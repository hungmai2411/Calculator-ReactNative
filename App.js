import { StatusBar } from 'expo-status-bar';
import { React, Component, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Calculation } from './calculation';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FontAwesome } from '@expo/vector-icons';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: "",
      userAnswer: "",
      calculations: [],
      isShowHistory: false,
    };
  }

  loadCalculation() {
    this.setState({
      isShowHistory: !this.state.isShowHistory,
    });
    for (let i = 0; i < this.state.calculations.length; i++) {
      console.log(this.state.calculations[i]);
    }
  }

  save(result) {
    let cal = new Calculation(this.state.userInput, result);

    this.setState({
      calculations: [...this.state.calculations, cal],
    });
  }

  calculateResult() {
    try {
      let text = this.state.userInput;

      text = text.replaceAll('x', '*');
      text = text.replaceAll('%', '/100');

      if (isOperator(text[text.length - 1])) {
        alert('Vui lòng nhập đúng định dạng');
      } else {
        this.save(eval(text));

        this.setState({
          userAnswer: eval(text),
        });
      }
    } catch (error) {
      alert('Vui lòng nhập đúng định dạng');
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

  onChangeText = (s) => {
    console.log(s);
    console.log(this.userInput);
    this.setState({
      userInput: s
    });
  }

  deleteHistory = () => {
    this.setState({
      calculations: []
    });
  }

  buttonPressed = (s) => {
    let text = this.state.userInput;

    if (s == '=') {
      return this.calculateResult();
    } else if (s == 'DEL') {
      return this.deleteLastInput();
    } else if (s == 'C') {
      return this.deleteUserInput();
    } else if (s == '()') {
      console.log(text);

      let lastBracketOpen = text.lastIndexOf('(');
      let lastBracketClose = text.lastIndexOf(')');

      if (lastBracketOpen == -1) {
        s = '(';
      } else if (lastBracketOpen > lastBracketClose) {
        s = ')';
      } else {
        s = '(';
      }
    } else if (isOperator(s) && text[text.length - 1] != '%') {

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
      '.', '0', '()', '=',
    ];

    let rows = [];
    let j = 0;
    let row = [];

    for (let i = 0; i < buttons.length; i++) {
      row.push(
        <TouchableOpacity
          style={isOperator(buttons[i]) ? styles.btnOperator : i == 0 ? styles.btnC : (i == 1) ? styles.btnDEL : styles.btn}
          key={buttons[i]}
          onPress={() => this.buttonPressed(buttons[i])}
        >
          <Text style={isOperator(buttons[i]) ? styles.textOperator : styles.text}>{buttons[i]}</Text>
        </TouchableOpacity>
      );

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
          <TextInput multiline={true} defaultValue={this.state.userInput} showSoftInputOnFocus={false} onChangeText={this.onChangeText} style={styles.calculationText}></TextInput>
        </View>
        <View style={styles.result}>
          <TextInput showSoftInputOnFocus={false} style={styles.resultText}>{this.state.userAnswer}</TextInput>
        </View>
        <View style={styles.history}>
          <TouchableOpacity onPress={() => this.loadCalculation()}>
            <>{
              this.state.isShowHistory ? <FontAwesome name="calculator" size={40} color="black" />
                : <FontAwesome name="history" size={40} color="black" />
            }
            </>
          </TouchableOpacity>
        </View>
        <>{
          !this.state.isShowHistory ?
            <View style={styles.buttons}>
              {rows}
            </View> :
            <View style={styles.listHistory} >
              <FlatList
                style={styles.list}
                data={this.state.calculations}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <TouchableOpacity
                      onPress={() => this.buttonPressed(item.calculation)}

                    >
                      <Text style={styles.calculationHistory}>{item.calculation}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.buttonPressed(item.result)}
                    >
                      <Text style={styles.resultHistory}>={item.result}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              <View>
                <TouchableOpacity style={styles.delHistory}
                  onPress={() => this.deleteHistory()}>
                  <Text >Delete History</Text>
                </TouchableOpacity>
              </View>
            </View>}
        </>

      </View >
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
  delHistory: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#cdcbcb',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#D0C5E9',
  },
  list: {
    // alignItems: 'flex-end',
    flexGrow: 1,
    marginVertical: 20,
    marginRight: 10,
  },

  item: {
    flexGrow: 1,
    alignItems: 'flex-end',
    marginBottom: 10,
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
  calculationHistory: {
    alignItems: 'flex-end',
    fontSize: 20,
  },
  resultHistory: {
    color: 'green',
    alignItems: 'flex-end',
    fontSize: 20,
  },
  history: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  buttons: {
    flex: 6,
    justifyContent: 'space-around',
    marginTop: 10,
  },

  listHistory: {
    flex: 6,
    backgroundColor: '#EDE7F6',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    marginTop: 10,
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
