import { StatusBar } from 'expo-status-bar';
import CalculatorScreen from './src/screens/calculator_screen';
import { React, Component, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: "",
      userAnswer: "",
    };
  }

  calculateResult() {
    let text = this.state.userInput;

    text = text.replaceAll('x', '*');
    text = text.replaceAll('%', '/100');

    if (isOperator(text[text.length - 1])) {
      this.setState({
        userAnswer: text,
      });
    } else {
      this.setState({
        userAnswer: eval(text),
      });
    }
  }

  deleteLastInput = () => {
    let text = this.state.userInput.substring(0, this.state.userInput.length - 1);

    this.setState({
      userInput: text
    });
  }

  deleteUserInput = () => {
    this.setState({
      userInput: ''
    });
  }

  buttonPressed = (s) => {
    if (s == '=') {
      return this.calculateResult();
    } else if (s == 'DEL') {
      return this.deleteLastInput();
    } else if (s == 'C') {
      return this.deleteUserInput();
    } else if (isOperator(s)) {
      let text = this.state.userInput;

      if (s == text[text.length - 1]) {
        console.log('2');
        return;
      }
      if (isOperator(text[text.length - 1])) {
        console.log('3');

        this.setState({
          userInput: this.state.userInput.substring(0, this.state.userInput.length - 1) + s
        });

        return;
      }
    }
    this.setState({
      userInput: this.state.userInput + s
    });
  }



  render() {
    let buttons = [
      'C', 'DEL', '%', '/',
      '9', '8', '7', 'x',
      '6', '5', '4', '-',
      '3', '2', '1', '+',
      '.', '0', '', '=',
    ];

    let rows = [];
    let j = 0;
    let row = [];

    for (let i = 0; i < buttons.length; i++) {
      if (i == 0) {
        row.push(
          <TouchableOpacity
            style={styles.btnC}
            key={buttons[i]}
            onPress={() => this.buttonPressed(buttons[i])}
          >
            <Text style={styles.textOperator}>{buttons[i]}</Text>
          </TouchableOpacity>
        );
      } else if (i == 1) {
        row.push(
          <TouchableOpacity
            style={styles.btnDEL}
            key={buttons[i]}
            onPress={() => this.buttonPressed(buttons[i])}
          >
            <Text style={styles.textOperator}>{buttons[i]}</Text>

          </TouchableOpacity>
        );
      } else if (isOperator(buttons[i])) {
        row.push(
          <TouchableOpacity
            key={buttons[i]}
            style={styles.btnOperator}
            onPress={() => this.buttonPressed(buttons[i])}
          >
            <Text style={styles.textOperator}>{buttons[i]}</Text>
          </TouchableOpacity>
        );
      } else {
        row.push(
          <TouchableOpacity
            style={styles.btn}
            key={buttons[i]}
            onPress={() => this.buttonPressed(buttons[i])}
          >
            <Text style={styles.text}>{buttons[i]}</Text>
          </TouchableOpacity>
        );
      }

      if (j == 3) {
        rows.push(<View key={i} style={styles.row}>{row}</View>)
        j = 0;
        row = [];
        continue;
      }
      j++;
    }

    return (
      <View style={styles.container}>
        <View style={styles.calculation}>
          <Text style={styles.calculationText}>{this.state.userInput}</Text>
        </View>
        <View style={styles.result}>
          <Text style={styles.resultText}>{this.state.userAnswer}</Text>
        </View>
        <View style={styles.buttons}>
          {rows}
        </View>
      </View>
    );
  }
}

function isOperator(s) {
  if (s == '%' || s == '/' || s == 'x' || s == '-' || s == '+' || s == '=') {
    return true;
  }
  return false;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D0C5E9',
  },
  calculation: {
    flex: 2,
    justifyContent: 'center',
  },
  result: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttons: {
    flex: 7,
    //margin: 5,
    justifyContent: 'space-around',
  },
  textOperator: {
    color: 'white',
    fontSize: 20,
  },
  text: {
    fontSize: 20,
  },
  btn: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: '#EDE7F6',
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  btnC: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: 'green',
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  btnDEL: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  btnOperator: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: "#6738B7",
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  resultText: {
    fontSize: 24,
  },
  calculationText: {
    fontSize: 30,
  }
});
