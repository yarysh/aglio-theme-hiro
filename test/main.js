const assert = require('node:assert')
const {readFileSync} = require('node:fs')
const {test} = require('node:test')

const rewire = require('rewire')


const main = rewire('../main.js')

test('dasherize test', async (t) => {
	const engine = main.__get__('engine')

	for (const [str, want] of Object.entries({
		'Foo bar': 'foo-bar',
		'Foo Bar': 'foo-bar',
		'FooBar': 'foo-bar',
		'FOOBAR': 'f-o-o-b-a-r',
		'Foobar': 'foobar',
		'foobar': 'foobar',
	})) {
		await t.test(str + " => " + want, (t) => {
			assert.equal(
				engine.parseAndRenderSync("{{ str | dasherize }}", {'str': str}),
				want,
			)
		})
	}
})

test('render test', (t, done) => {
	// API Blueprint AST was generated with aglio from api.md
	const api = JSON.parse(readFileSync(__dirname + "/api.json").toString())

	main.render(api, null, (err, got) => {
		const want = readFileSync(__dirname + "/api.html").toString()
		if (got !== want) {
			done(new Error('rendering failure'))
			return
		}
		done()
	})
})
