let input = document.getElementById('input');
let output = document.getElementById('output');
let runBtn = document.getElementById('runBtn');
let resetBtn = document.getElementById('resetBtn');

window.onload = () => {
    //input.value = '';
    //output.value = '';
}

/* window.onerror = (message, source, lineno, colno, error) => {
    console.log('Start onerror');
    console.log(message);
    console.log(source);
    console.log(lineno);
    console.log(colno);
    console.log(error);
    console.log('End onerror');
} */


const config = {
    editor: {
        mode: 'javascript',
        lineNumbers: true,
        lineWrapping: true
    },
    console: {
        readOnly: 'nocursor'
    }
}

const thisEditor = CodeMirror(input, config.editor);
const thisConsole = CodeMirror(output, config.console);



const loggingPart1 = `
    console.oldLog = console.log;
    let fullLog = '';
    console.log = (value) => {
        //thisConsole.setValue(value);        
        fullLog+= (value + \"\\n\");
    }
`;

const loggingPart2 = `
    thisConsole.setValue(fullLog);
    console.log = console.oldLog;
`;

runBtn.addEventListener('click', () => {
    thisConsole.setValue(''); //Reset output field
    const val = thisEditor.getValue();
    const evalCode = `
    try{
        ${val}
    } catch(err){
        fullLog += err.toString();
    }`;

    const arg = loggingPart1 + evalCode +loggingPart2;

    const fullArg = `
        try{
            ${arg};
        } catch(e){
            console.log('error');
            console.log(e);
        }
    `
    let F = new Function(fullArg);
    try {
        F();
    } catch(e){
        console.log('err');
        console.log(e);
        console.oldLog(e);
    }


});

resetBtn.addEventListener('click', () => {
    thisEditor.setValue('');
    thisConsole.setValue('');
});