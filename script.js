
const messages = []

const previewContainer = document.querySelector('#preview')

function preview() {

  messages.length = 0
  previewContainer.innerHTML = ''

  const rawVariables = document.setup.variables.value
  const rawRecipientPattern = document.setup.recipient.value
  const rawSubjectPattern = document.setup.subject.value
  const rawBodyPattern = document.setup.body.value

  let tempVariables = csvStringToArray(rawVariables)
  let variablesNames = tempVariables[0]
  let variables = tempVariables.slice(1)

  variables.forEach((row, rowIndex) => {
    let recipient = rawRecipientPattern
    let subject = rawSubjectPattern
    let body = rawBodyPattern
    variablesNames.forEach((variable, variableIndex) => {
      recipient = recipient.replace(new RegExp(`%${variable}%`, 'ig'), row[variableIndex])
      subject = subject.replace(new RegExp(`%${variable}%`, 'ig'), row[variableIndex])
      body = body.replace(new RegExp(`%${variable}%`, 'ig'), row[variableIndex])
    })
    messages.push({ recipient, subject, body })

    let previewDiv = document.createElement('div')
    previewDiv.innerHTML = `<div class="card">
    <div class="card-body">
      <h5 class="card-title">#${rowIndex + 1}</h5>
      <h6 class="card-subtitle mb-2 text-muted">Recipient: ${recipient}</h6>
      <h6 class="card-subtitle mb-2 text-muted">Subject: ${subject}</h6>
      <p class="card-text">${body.replace(/\n/g, '<br/>')}</p>
    </div>
  </div>`
    previewContainer.appendChild(previewDiv)
  })
  previewContainer.scrollIntoView({behavior: 'smooth'})
}

function sendHandler () {
  preview()
  send(0)
}

function send(i) {
  if(message = messages[i]){
      location.href = `mailto:${message.recipient}?subject=${message.subject}&body=${message.body.replace(/\n/g, '%0D%0A')}`
    }
  if(messages[i + 1]){
    window.setTimeout( () => send(i + 1), 500)
  }
}

function fillSampleData() {
  if (
    (document.setup.variables.value || document.setup.recipient.value || document.setup.subject.value || document.setup.body.value)
    &&
    !confirm('Are you sure you want to replace all existing data in the "setup" form with sample data? This cannot be undone.')
  ) {
    return false
  }
  else {
    document.setup.variables.value = `email,firstname,lastname
spiderman@superheroes.org,Peter,Parker
harley-quinn@superheroes.org,Harleen Frances,Quinzel`

    document.setup.recipient.value = '%email%'
    document.setup.subject.value = 'Invitation for %firstname% %lastname% to join us'
    document.setup.body.value = `Hi %firstname%!

This is just a sample message, I think your details are:
* %lastname%, %firstname%
* %email%

Take care!
An admirer`
  }
}

// https://gist.github.com/Jezternz/c8e9fafc2c114e079829974e3764db75
const csvStringToArray = strData => {
  if(!strData) return []
  const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
  let arrMatches = null, arrData = [[]];
  while (arrMatches = objPattern.exec(strData)){
      if (arrMatches[1].length && arrMatches[1] !== ",")arrData.push([]);
      arrData[arrData.length - 1].push(arrMatches[2] ? 
          arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") :
          arrMatches[3]);
  }
  return arrData;
}