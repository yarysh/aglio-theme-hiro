const path = require('path')

const { Liquid } = require('liquidjs')
const MarkdownIt = require('markdown-it')


const md = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
})

const engine = new Liquid({
	extname: '.liquid',
	partials: path.join(__dirname, 'blocks'),
	root: __dirname,
})

engine.registerFilter('dasherize', (initial) => {
	return initial
		.replace(/[A-Z]/g, (char, index) => {
			return (index !== 0 ? '-' : '') + char.toLowerCase()
		})
		.replace(/[ _-]+/g, '-')
		.toLowerCase()
})

engine.registerFilter('labelize', (initial) => {
	switch (initial) {
		case "GET":
			return "primary"
		case "POST":
			return "success"
		case "PUT":
			return "info"
		case "PATCH":
			return "warning"
		case "DELETE":
			return "danger"
	}
	return "default"
})

engine.registerFilter('markdownize', (initial) => {
	return md.render(initial)
})

exports.getConfig = () => {
	return {
		formats: ['1A'],
		options: [],
	}
}

exports.render = (api, options, done) => {
	engine.renderFile('template', {"api": api}).then((content) => {
		done(null, content)
	})
}
