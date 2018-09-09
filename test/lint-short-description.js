// Examples:
// Check the color property page summary on MDN:
//    $ npm run lint-short-description color
// Check the color and background-color properties' page summaries on MDN
//    $ npm run lint-short-description color background-color
// Run a self-test of this linter
//    $ npm run lint-short-description -- --self-test

const fs = require('fs');

const request = require('request')
const jsdom = require('jsdom')

const properties = JSON.parse(fs.readFileSync('css/properties.json', 'utf-8'))

const lengthLimit = 180
const allowed = {
  'A': ['href'],
  'CODE': [],
  'EM': [],
  'STRONG': [],
}

const cli = async () => {
  process.argv.includes('--self-test') ? test() : main(process.argv.slice(2))
}

const main = async (args) => {
  try {
    while (args.length) {
      let prop = args.shift()
      let url = nameToURL(prop)
      const summary = await getSummaryData(url)

      checkSummary(summary, prop, url)
    }
  }
  catch (e) {
    console.trace(e)
  }
}

const test = () => {
  const exampleOK = `The <strong><code>color</code></strong> CSS property sets the foreground <a href="https://developer.mozilla.org/docs/Web/CSS/color_value">color value</a> of an element's text and <a href="https://developer.mozilla.org/docs/Web/CSS/text-decoration">text decorations</a>. It also sets the <a href="https://developer.mozilla.org/docs/Web/CSS/currentcolor"><code>currentcolor</code></a> value, an indirect value on <em>other</em> properties.`
  const exampleNotOK = `The <strong><code>color</code></strong> CSS property sets the foreground <a href="/en-US/docs/Web/CSS/color_value">color value</a> of an element's text content and <a href="/en-US/docs/Web/CSS/text-decoration">text decorations</a>. It also sets the <a href="/en-US/docs/Web/CSS/currentcolor" title="The &lt;color&gt; CSS data type represents a color in the sRGB color space. A &lt;color&gt; may also include an alpha-channel transparency value, indicating how the color should composite with its background."><code>currentcolor</code></a> value, which may be used as an indirect value on <em>other</em> properties, and is the default for other color properties, such as <a href="/en-US/docs/Web/CSS/border-color" title="The border-color CSS property is a shorthand property for setting the colors on all four sides of an element's border."><code>border-color</code></a>. <span>This tag is not allowed</span>. And neither is <br/>.`

  console.log('-- Testing OK text --')
  checkSummary(exampleOK, 'color', 'https://developer.mozilla.example/thisIsNotARealURL')

  console.log('-- Testing not OK text --')
  checkSummary(exampleNotOK, 'color', 'https://developer.mozilla.example/thisIsNotARealURL')
}

const nameToURL = (property) => {
  // turn a CSS property name into an raw MDN page summary URL
  if (properties[property] === undefined) {
    console.error(`${property} does not have an MDN URL`)
    process.exit(1)
  }

  return `${properties[property].mdn_url}?summary&raw`
}

const getSummaryData = async (url) => {
  // fetch URL (returns a Promise)
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      error ? reject(error) : {}
      resolve(body)
    })
  })
}

const checkSummary = (summaryData, propertyName, url) => {
  let status = true
  const summaryDom = new jsdom.JSDOM(summaryData)
  const summaryText = summaryDom.window.document.querySelector('body').textContent

  console.log(`Checking \x1b[1m${propertyName}\x1b[0m (${url})`)

  if (!isLengthOK(summaryText)) {
    status = false
    console.error(`    ❌ ${propertyName} summary is too long. Expected <${lengthLimit} displayed characters, got ${summaryText.length}`)
    console.error(`        ${summaryText.slice(0,180)}\x1b[41m${summaryText.slice(180)}\x1b[0m`)
  }

  const tagSet = getTagSet(summaryDom)
  if (!areTagsOK(tagSet)) {
    status = false
    console.error(`    ❌ ${propertyName} summary contains forbidden tags: ${forbiddenTags(tagSet).join(', ')}`)
  }

  if (!areAttrsOK(summaryDom)) {
    status = false
    const attrs = forbiddenAttrs(summaryDom)
    console.error(`    ❌ ${propertyName} summary contains forbidden attributes: ${attrs.join(', ')}`)
  }

  status ? console.log(`✅ \x1b[1m${propertyName}\x1b[0m (${url}) is OK`) : console.error(`❌ \x1b[1m${propertyName}\x1b[0m (${url}) has problems, see above`)
}

const isLengthOK = (text) => lengthLimit > text.length

const areTagsOK = (tagSet) => forbiddenTags(tagSet).length === 0

const forbiddenTags = (tagSet) => Array.from(tagSet).filter(value => !Object.keys(allowed).includes(value))

const getTagSet = (dom) => {
  const tagSet = new Set()
  for (const elem of dom.window.document.querySelectorAll('BODY *')) {
    tagSet.add(elem.tagName)
  }
  return tagSet
}

const areAttrsOK = (dom) => 0 === forbiddenAttrs(dom).length

const forbiddenAttrs = (dom) => {
  let badAttrs = []

  for (const elem of dom.window.document.querySelectorAll('BODY *')) {
    const allowedAttrs = allowed[elem.tagName]

    if (allowedAttrs === undefined) {
      continue
    }

    const attrNames = Array.from(elem.attributes).map(value => value.name)
    attrNames.filter(attr => !allowedAttrs.includes(attr))
      .forEach(attr => badAttrs.push(`${elem.tagName}.${attr}`))
  }

  return badAttrs
}

cli()
