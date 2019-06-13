import React from 'react';
import { AppRegistry, Image, StatusBar, StyleSheet } from 'react-native';
import { Container, Content, Text, List, ListItem, Item, Left, Body, Icon, Footer } from 'native-base';
import { NavigationActions } from "react-navigation";
import  Environment  from '../../environments/environment';
import ColorConfig from '../../config/color.config';
import UserService from '../../helpers/user.service';
import AlertHelper from '../../helpers/alert.helper';
import I18n from 'react-native-i18n'

const routes: menuItem[] = [
 
];

interface menuItem {
  text: string;
  link: boolean;
  icon: string;
  value:string;
}

interface Props {
  navigation: any;
}

interface State { }

export default class SideBar extends React.Component<Props, State> {
  render() {
    const list = Object.assign([], routes);
    const userNickname = this.getUserNickname();
    list.push({ text: I18n.t("scanRoot"), value:"ScanRoot",link: true, icon: 'md-qr-scanner' });
    list.push({ text: I18n.t("logout") , value:"Logout",link: true, icon: 'md-power' });
    list.push({ text: I18n.t("lock"), value:"Lock",link: true, icon: 'md-lock' });
    list.push({ text: userNickname, link: false, icon: 'md-contact' });

    return (
      <Container style={{    backgroundColor: ColorConfig.GRAY_HEADER_BACKGROUND
      }}>
        <Content>
          <Item style={{ flexDirection: 'column',alignItems: 'center',justifyContent: 'center',borderColor: ColorConfig.GRAY_HEADER_BACKGROUND,paddingTop: 20,paddingBottom: 20}}>
            <Text style={styles.title}>Logistics</Text>
            <Text style={styles.version}>{I18n.t('version')} {Environment.Version}</Text>
          </Item>
          <List style={styles.menuList}
            dataArray={list}
            renderRow={data => {
              return (
                <ListItem icon
                  style={styles.menuListItem}
                  button
                  onPress={() => this.onPressMenu(data)}>
                  <Left>
                    <Icon style={styles.menuItemIcon} name={data.icon} />
                  </Left>
                  <Body>
                    <Text style={styles.menuItemText}>{data.text}</Text>
                  </Body>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }

  onPressMenu(menuItem: menuItem) {
    if (!menuItem.link) {
      return;
    }
    switch (menuItem.value) {
      case 'Logout':
        this.logOut();
        break;
      default:
        this.props.navigation.navigate(menuItem.value);
        break;
    }
  }

  logOut() {
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'Login' })
    //   ]
    // })

    UserService.logOut()
      .then(() => this.props.navigation.navigate('Login'))
      .catch((error) => AlertHelper.alertError(error.message));
  }

  getUserNickname() {
    if (!UserService.currentUser) {
      return 'No Login User';
    } else {
      return UserService.currentUser.attributes.nickname;
    }
  }
}

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: ColorConfig.GRAY_HEADER_BACKGROUND
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: ColorConfig.GRAY_HEADER_BACKGROUND,
    paddingTop: 20,
    paddingBottom: 20
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    // marginTop: 20,
    // marginBottom: 40,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  version: {
    color: ColorConfig.GRAY_NOTE
  },
  menuList: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.0)'
  },
  menuListItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    borderColor: '#2D2D2D'
  },
  menuItemIcon: {
    alignItems: 'center',
    color: '#AAAAAA'
  },
  menuItemText: {
    color: '#AAAAAA'
  },
  footer: {
    borderWidth: 0,
    backgroundColor: ColorConfig.GRAY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center'
  },
});