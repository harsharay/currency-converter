import React,{ useState,useEffect } from 'react';
import { TextField,Button } from  "@material-ui/core";

function Converter() {
    
    let [state,setState] = useState({
        currencies : [],
        inputValue: null,
        from_currentValue: 'CAD',
        to_currentValue: 'CAD',
        current_exchangeRate: null,
        output: null
    })


    useEffect(() => {
        fetch("https://api.exchangeratesapi.io/latest")
        .then(response => response.json())
        .then(data => setState(prevValue => {
            return {
                ...prevValue,
                currencies: Object.keys(data.rates)
            }
        }))
    },[])

    useEffect(() => {
        fetch(`https://api.exchangeratesapi.io/latest?base=${state.from_currentValue}&symbols=${state.to_currentValue}`)
        .then(data => data.json())
        .then(json => setState(prevValue => {
            return {
                ...prevValue,
                current_exchangeRate: Object.values(json.rates)[0]
            }
    }))
            
    },[state.from_currentValue,state.to_currentValue])

    //HandleInput for the input value
    const handleInput = e => {
        let newVal = e.target.value;
        setState(prevValue => {
            return {
                ...prevValue,
                inputValue : newVal
            }
        })
    }

    //HandleChange function to select value in dropdown
    const handleChange = e => {
        let newVal = e.target.value;
        let name = e.target.name;
        setState(prevVal => {
            if(name==="from_currentValue"){
                return {
                    ...prevVal,
                    from_currentValue: newVal
                }
            } else if(name==="to_currentValue"){
                return {
                    ...prevVal,
                    to_currentValue: newVal
                }
            }
        })
    }

    //HandleClick function to fetch the latest data for the selected value in the dropdown
    //Its an async function since it has to depend on the updation of value 
    const handleClick = async () => {
        
        if(state.inputValue){
            setState(prevVal => {
                return {
                    ...prevVal,
                    output: state.inputValue * state.current_exchangeRate
                }
            })
        }
    }


    return (
        <div className="container">
            <h1 className="heading">Converter App</h1>
            <TextField
                id="standard-number"
                label="Enter Currency"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }} 
                onChange={handleInput} 
                value={state.inputValue}
                />
            <div className="currency-block">
                <div className="from-block">
                    <h2 className="from-h2">From</h2>
                    <div>
                        <select id="from-menu" onChange={handleChange} name="from_currentValue">
                        {state.currencies.map((item,index) => {
                            return (
                                <option key={index}>{item}</option>
                            )
                        })}
                        </select>
                    </div>
                </div>
                <div className="to-block">
                    <h2 className="to-h2">To</h2>
                    <div>
                        <select id="to-menu" onChange={handleChange} name="to_currentValue">
                        {state.currencies.map((item,index) => {
                            return (
                                <option key={index}>{item}</option>
                            )
                        })}
                        </select>
                    </div>
                </div>
                <Button variant="contained" color="secondary" onClick={handleClick}>
                    Go
                </Button>
            </div>
            <div className="equals">
                <h1>=</h1>
            </div>
            <div className="output">
                <h1>{state.output}</h1>
            </div>
            <footer className='footer'>
                <p>How to use?</p>
                <p>1. Enter a value into the field</p>
                <p>2. Select the conversion values both <em><strong>from and to</strong></em></p>
            </footer>
        </div>
    )
}

export default Converter
