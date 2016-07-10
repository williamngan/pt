## Use markdown library with fenced code extension
python -m markdown -x markdown.extensions.fenced_code quickstart.md > _convert.html

## Update fenced code to use prism class
"```language-javascript"

### If extra line found in generated </code>, remove with regex
`\n    </code>`