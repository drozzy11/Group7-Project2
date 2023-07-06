// Include the Handlebars library 
const Handlebars = require('handlebars');

// The data object that contains the dynamic content
const data = {
  title: 'Music Head',
  message: 'Hello, music listeners!',
  items: ['Genre', 'Populairty', '# of songs']
};

// The Handlebars template
const template = Handlebars.compile(`
  <h1>{{title}}</h1>
  <p>{{Welcome user}}</p>
  <ul>
    {{#each items}}
      <li>{{this}}</li>
    {{/each}}
  </ul>
`);

// Render the template with the data
const result = template(data);

// Output the result
console.log(result);
