const express = require('express');
const app = express();

const PORT = 7780;

const defaultData = {
    name: '',
    surname: '',
    age: '',
};

const getHomePage = (data, error) => `
    <h1>Home work 1</h1>
    <h3>Acquaintance</h3>
    <span>Please, enter your data</span>
    <br><br>
    <div>
        <form action="/validate">
          <label for="GET-name">Name:</label>
          <input id="GET-name" type="text" name="name" value="${data.name}">
          <br><br>
          <label for="GET-surname">Surname:</label>
          <input id="GET-surname" type="text" name="surname" value="${data.surname}">
          <br><br>
          <label for="GET-age">Age:</label>
          <input id="GET-age" type="number" name="age" value="${data.age}">
          <br><br>
          <button type="submit">Submit</button>
        </form>
    </div>
    ${error ? '<hr><h3 style="color: red">Validation error</h3><span>' + error + '</span>': ''}
    `;

const getPageSuccess = (data) => `
    <h2 style="color: green">Success</h2>
    <div>
        <span>Glad to meet you, ${data.name} ${data.surname}!</span><br>
        <span>My name is Siarhei Salimau.</span><br>
        <span>I'll never believe that you are ${data.age} years old!</span>
    </div>
    <br>
    <a href="/">From the beginning</a>
`;

const isStringValid = (str) => !!str && str.length > 2 && str.length < 30;

const isAgeValid = (age) => !!age && age > 0 && age < 100;

const isFormDataValid = ({name, surname, age}) => isStringValid(name) && isStringValid(surname) && isAgeValid(+age);

function getErrorText(formData) {
    const errorField = [];
    const errorType = { string: false, number: false };
    
    if (!isStringValid(formData.name)) {
        errorField.push('name');
        errorType.string = true;
    }
    
    if (!isStringValid(formData.surname)) {
        errorField.push('surname');
        errorType.string = true;
    }
    
    if (!isAgeValid(+formData.age)) {
        errorField.push('age');
        errorType.number = true;
    }
    
    return `Please, enter correct ${errorField.join(', ')}!
        ${errorType.string ? 'Name and surname must be more then 2 and less then 30 characters. ' : ''}
        ${errorType.number ? 'Age must be a number between 0 and 100. ' : ''}
        `;
}

app.get('/', (req, res) => {
    res.send(getHomePage(defaultData));
});

app.get('/validate', (req, res) => {
    const formData = req.query;
    
    isFormDataValid(formData) ? res.send(getPageSuccess(formData)) : res.send(getHomePage(formData, getErrorText(formData)));
});

app.listen(PORT, () => {
    console.log('Server has been started......');
});
