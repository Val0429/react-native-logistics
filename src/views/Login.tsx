import React from 'react';
import { Observable } from 'rxjs/Rx';
import { StatusBar, StyleSheet } from 'react-native';
import { Button, Text, Container, Content, Form, Item, Input, Icon, Left, Body, Right, Label, Header, Title, Spinner, Footer, FooterTab,Picker } from 'native-base';
import autobind from 'class-autobind';
import UserService from '../helpers/user.service';
import AppCore from '../helpers/core.service';
import { ILoginConfig, ConfigKeys } from '../domain/storage';
import { ParseConfig } from '../config/parse.config';
import ColorConfig from '../config/color.config';
import AlertHelper from '../helpers/alert.helper';
import StringHelper from '../helpers/string.helper';

import I18n from 'react-native-i18n'
// const Parse = require('parse/react-native');

interface Props {
  navigation: any;
}



interface State {
  ip: string;
  port: string;
  account: string;
  password: string;
  loading: boolean;
  language:string
}

export class Login extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      ip: '',
      port: '',
      account: '',
      password: '',
      loading: false,
      language:''
    };
  }

  componentDidMount() {
    this.getLoginConfig();
  }

  render() {
    return (
      <Container style={{backgroundColor: ColorConfig.GRAY_BACKGROUND}}>
        <Content style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1,justifyContent: 'center',alignItems: 'center'}}
          scrollEnabled={false}>
          <Text style={styles.title}>Logistics</Text>
          <Form style={{ backgroundColor: 'white',width: '90%',borderRadius: 5,padding: 15}}>
            <Item regular style={{ backgroundColor: ColorConfig.GRAY_INPUT_BACKGROUND,borderColor: ColorConfig.GRAY_INPUT_BACKGROUND,borderRadius: 5,marginBottom: 10}}>
              <Input
                placeholder={I18n.t('ipaddress')}
                autoCapitalize='none'
                onChangeText={(ip) => this.setState({ ip })}
                value={this.state.ip} />
            </Item>
            <Item regular style={{ backgroundColor: ColorConfig.GRAY_INPUT_BACKGROUND,borderColor: ColorConfig.GRAY_INPUT_BACKGROUND,borderRadius: 5,marginBottom: 10}}>
              <Input
                placeholder={I18n.t('port')}
                autoCapitalize='none'
                onChangeText={(port) => this.setState({ port })}
                value={this.state.port} />
            </Item>
            <Item regular style={{ backgroundColor: ColorConfig.GRAY_INPUT_BACKGROUND,borderColor: ColorConfig.GRAY_INPUT_BACKGROUND,borderRadius: 5,marginBottom: 10}}>
              <Input
                placeholder={I18n.t('email')}
                autoCapitalize='none'
                onChangeText={(account) => this.setState({ account })}
                value={this.state.account} />
            </Item>
            <Item regular style={{ backgroundColor: ColorConfig.GRAY_INPUT_BACKGROUND,borderColor: ColorConfig.GRAY_INPUT_BACKGROUND,borderRadius: 5,marginBottom: 10}}>
              <Input
                placeholder={I18n.t('pass')}
                autoCapitalize='none'
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                secureTextEntry={true} />
            </Item>
            <Item regular
              style={{
                backgroundColor: ColorConfig.GRAY_INPUT_BACKGROUND,
                borderColor: ColorConfig.GRAY_INPUT_BACKGROUND,
                borderRadius: 5,
                marginBottom: 10
              }} >
              <Picker
                selectedValue={this.state.language}
                style={{ height: 50, width: '100%' }}
                onValueChange={(itemValue, itemIndex) =>{
                  I18n.locale=itemValue;
                  this.setState({ language: itemValue })
                }
                  
                }
              >
                <Picker.Item label="English" value="en" />
                <Picker.Item label="中文" value="zh" />
              </Picker>
            </Item>
            <Item style={{ flexDirection: 'row',justifyContent: 'flex-end',borderBottomWidth: 0}}>
              <Button style={{  backgroundColor: ColorConfig.GRAY_BUTTON_BACKGROUND,borderColor: ColorConfig.GRAY_BUTTON_BORDER,borderWidth: 1}}
                onPress={this.logIn}>
                <Text>{I18n.t('login')}</Text>
              </Button>
            </Item>
          </Form>
          {this.state.loading && <Spinner color='#565656' />}
        </Content>
        <Footer style={{  borderWidth: 0,backgroundColor: ColorConfig.GRAY_BACKGROUND,justifyContent: 'center',alignItems: 'center'}}>
          <Text style={styles.footerText}>2017 © Hiwin Copyright Reserved.</Text>
        </Footer>
      </Container>
    );
  }

  getLoginConfig() {
    AppCore.getStorage(ConfigKeys.login)
      .then(config =>
        {
          I18n.locale=config.language ;
          this.setState({ ip: config.ip, port: config.port, account: config.account, language:config.language });
        })
      .catch((error) => console.log(error.message));
  }
 
  logIn() {
    if (this.state.loading) {
      return;
    }
    if (!this.state.port || Number(this.state.port) > 65535 || Number(this.state.port) < 1) {
      AlertHelper.alertError(I18n.t('PleaseInputLegalPort'));
      return;
    }
    if (StringHelper.isNullOrEmpty(this.state.ip)) {
      AlertHelper.alertError( I18n.t('pleaseInputIpPortBeforeLogin'));
      return;
    }

    AppCore.initParse({ ip: this.state.ip, port: this.state.port});
    this.saveLoginConfig();
    this.setState({ loading: true });
    UserService.logInByEmail({ email: this.state.account, password: this.state.password })
      .then(() => {
        this.setState({ loading: false });
        this.props.navigation.navigate('ScanRoot');
      })
      .catch((error) => {
        this.setState({ loading: false });
        AlertHelper.alertError(error.message);
      });
  }

  saveLoginConfig() {
    AppCore.setStorage(ConfigKeys.login, {
      ip: this.state.ip,
      port: this.state.port,
      account: this.state.account,
      language:this.state.language
    });
  }
}

const styles = StyleSheet.create({
  baseContainer: {
    backgroundColor: ColorConfig.GRAY_BACKGROUND
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginForm: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 5,
    padding: 15
  },
  regularInput: {
    backgroundColor: ColorConfig.GRAY_INPUT_BACKGROUND,
    borderColor: ColorConfig.GRAY_INPUT_BACKGROUND,
    borderRadius: 5,
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    color: ColorConfig.GRAY_TITLE,
    marginBottom: 15
  },
  loginButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth: 0
  },
  loginButton: {
    backgroundColor: ColorConfig.GRAY_BUTTON_BACKGROUND,
    borderColor: ColorConfig.GRAY_BUTTON_BORDER,
    borderWidth: 1
  },
  footer: {
    borderWidth: 0,
    backgroundColor: ColorConfig.GRAY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    color: ColorConfig.GRAY_LABEL,
    fontSize: 16
  }
});