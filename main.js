document.addEventListener('DOMContentLoaded', main);

async function main() {
  let protocols = await Promise.all([
    fetch('./browser_protocol.json').then(r => r.json()),
    fetch('./js_protocol.json').then(r => r.json()),
  ]);
  let allDomains = [];
  for (let protocol of protocols)
    allDomains.push(...protocol.domains);
  let domains = new Map();
  for (let domain of allDomains)
    domains.set(domain.domain, domain);
  let e = renderDomain(domains.get('Network'));
  document.body.appendChild(e);
}

function renderDomain(domain) {
  let main = E.div('domain');

  {
    // Render domain main description.
    let container = main.div('box');

    let title = container.el('h2');
    title.textContent = domain.domain;

    let description = container.el('p');
    description.textContent = domain.description;
  }

  if (domain.commands && domain.commands.length) {
    // Render methods.
    let title = main.el('h3');
    title.textContent = 'Methods';
    let container = main.box('box');
    for (let i = 0; i < domain.commands.length; ++i) {
      let method = domain.commands[i];
      container.appendChild(renderMethod(domain, method));
    }
  }

  if (domain.events && domain.events.length) {
    // Render events.
    let title = main.el('h3');
    title.textContent = 'Events';
    let container = main.box('box');
    for (let i = 0; i < domain.events.length; ++i) {
      let event = domain.events[i];
      container.appendChild(renderMethod(domain, event));
    }
  }

  if (domain.types && domain.types.length) {
    // Render events.
    let title = main.el('h3');
    title.textContent = 'Types';
    let container = main.box('box');
    for (let i = 0; i < domain.types.length; ++i) {
      let type = domain.types[i];
      container.appendChild(renderType(domain, type));
    }
  }

  return main;
}

function renderType(domain, type) {
  //let main = document.createDocumentFragment();//E.vbox('method');
  let main = E.div('type');
  {
    // Render heading.
    let heading = main.el('h4', 'monospace');
    heading.text = type.id;
  }
  {
    // Render description.
    let p = main.el('p');
    p.textContent = type.description;
    if (type.experimental)
      p.appendChild(experimentalMark());
  }
  if (type.properties && type.properties.length) {
    // Render parameters.
    let title = main.el('h5');
    title.textContent = 'Properties';
    let container = main.el('dl', 'parameter-list');
    for (let parameter of type.properties)
      container.appendChild(renderParameter(parameter));
  }
  return main;
}

function renderMethod(domain, method) {
  //let main = document.createDocumentFragment();//E.vbox('method');
  let main = E.div('method');
  {
    // Render heading.
    let heading = main.el('h4', 'monospace');
    heading.addText(domain.domain + '.', 'method-domain');
    heading.addText(method.name, 'method-name');
  }
  {
    // Render description.
    let p = main.el('p');
    p.textContent = method.description;
    if (method.experimental)
      p.appendChild(experimentalMark());
  }
  if (method.parameters && method.parameters.length) {
    // Render parameters.
    let title = main.el('h5');
    title.textContent = 'Parameters';
    let container = main.el('dl', 'parameter-list');
    for (let parameter of method.parameters)
      container.appendChild(renderParameter(parameter));
  }
  if (method.returns && method.returns.length) {
    // Render return values.
    let title = main.el('h5');
    title.textContent = 'RETURN OBJECT';
    let container = main.el('dl', 'parameter-list');
    for (let parameter of method.returns)
      container.appendChild(renderParameter(parameter));
  }
  return main;
}

function renderParameter(parameter) {
  let main = E.hbox('parameter');
  {
    // Render parameter name.
    let name = main.div('parameter-name monospace');
    if (parameter.optional)
      name.classList.add('optional');
    name.textContent = parameter.name;
  }
  {
    // Render parameter value.
    let container = main.vbox('parameter-value');
    container.appendChild(renderTypeLink(parameter));
    let description = container.addText(parameter.description, 'parameter-description');
    if (parameter.experimental)
      description.appendChild(experimentalMark());
  }
  return main;
}

function renderTypeLink(parameter) {
  return E.text('<TYPE>', 'parameter-type');
}

function experimentalMark() {
  var e = E.text('experimental', 'experimental');
  e.title = 'This may be changed, moved or removed';
  return e;
}

// HELPERS

class E {
  static el(name, className) {
    let e = document.createElement(name);
    if (className)
      e.className = className;
    return e;
  }

  static box(className) {
    let e = E.el('div', className);
    e.classList.add('box');
    return e;
  }

  static div(className) {
    return E.el('div', className);
  }

  static span(className) {
    return E.el('span', className);
  }

  static hbox(className) {
    let e = E.el('div', className);
    e.classList.add('hbox');
    return e;
  }

  static vbox(className) {
    let e = E.el('div', className);
    e.classList.add('vbox');
    return e;
  }

  static text(text, className) {
    let e = E.el('span', className);
    e.textContent = text;
    return e;
  }
};

Node.prototype.div = function(className) {
  let div = E.div(className);
  this.appendChild(div);
  return div;
}

Node.prototype.span = function(className) {
  let span = E.span(className);
  this.appendChild(span);
  return span;
}


Node.prototype.box = function(className) {
  let box = E.box(className);
  this.appendChild(box);
  return box;
}

Node.prototype.hbox = function(className) {
  let box = E.hbox(className);
  this.appendChild(box);
  return box;
}

Node.prototype.vbox = function(className) {
  let box = E.vbox(className);
  this.appendChild(box);
  return box;
}

Node.prototype.addText = function(text, className) {
  let t = E.text(text, className);
  this.appendChild(t);
  return t;
}

Node.prototype.el = function(name, className) {
  let el = E.el(name, className);
  this.appendChild(el);
  return el;
}
