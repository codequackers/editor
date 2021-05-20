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
        lineWrapping: true,
        value: "for(let i = 2; i <= 10; i++){ \n console.log(\"Kvadrattallet til \" + i + \" er \"+i*i); \n }"
    },
    console: {
        readOnly: 'nocursor',
        lineNumbers: false
    }
}

const thisEditor = CodeMirror(input, config.editor);
const thisConsole = CodeMirror(output, config.console);

const loggingPart1 = `
    console.oldLog = console.log;
    let fullLog = '';
    console.log = (value) => {
        //thisConsole.setValue(value);        
        fullLog+= (\" > \" + value + \"\\n\");
    }
`;

const loggingPart2 = `
    thisConsole.setValue(fullLog);
    console.log = console.oldLog;
`;

runBtn.addEventListener('click', () => {
    thisConsole.setValue(''); //Reset output field
    const val = thisEditor.getValue();

    // Step 1: Evaluate input code and check for errors
    try {
        let F1 = new Function(val);
        F1();
    } catch (err) {
        // If error: log to console and return
        thisConsole.setValue(err.toString());
        return;
    }

    //Step 2: Inject own code to handle console.log.
    const arg = loggingPart1 + val +loggingPart2;

    try {
        let F = new Function(arg);
        F();
    } catch(e){
        //For testing if any errors occur after injection.
        console.log('err');
        console.log(e);
        console.oldLog(e);
        thisConsole.setValue(e.toString());
    }

   

});

resetBtn.addEventListener('click', () => {
    thisEditor.setValue('');
    thisConsole.setValue('');
});