import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, List, ListItem, Text, Card, CardItem, Item } from 'native-base';
import { ScanEvent } from '../../domain/core';
import Parse from 'parse/react-native';
import ColorConfig from '../../config/color.config';
import I18n from 'react-native-i18n'

interface Props {
    navigation: any;
}
interface State {
    currentOrder: ScanEvent;
    currentPackage: ScanEvent[];
}

export default class ScanRecord extends Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            currentOrder: this.props.navigation.state.params.currentOrder,
            currentPackage: this.props.navigation.state.params.currentPackage
        }

        console.log(this.state.currentOrder);
    }

    render() {
        return (
            <Container style={{backgroundColor: ColorConfig.GRAY_BACKGROUND}}>
                <Header style={{backgroundColor: ColorConfig.GRAY_HEADER_BACKGROUND}}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon name='ios-arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title> {I18n.t('scanRecord')}</Title>
                    </Body>
                    <Right />
                </Header>
                <Content style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                    scrollEnabled={false}>
                    <Item style={{backgroundColor: ColorConfig.WHITE,flexDirection: 'column',alignItems: 'flex-start',paddingLeft: 10,paddingRight: 10}}>
                        <Text>{I18n.t('location')} : {this.state.currentOrder.location.name}</Text>
                        {this.state.currentOrder && <Text note> {I18n.t('orderSingleNo')}:{this.state.currentOrder.scanData}</Text>}
                        {this.state.currentPackage.length > 0 && <Text note>{I18n.t('packageQty')}: {this.state.currentPackage.length}</Text>}
                    </Item>
                    <List
                        dataArray={this.state.currentPackage}
                        renderRow={(item) =>
                            <Card>
                                <CardItem>
                                    <Body>
                                        <Text>Mfg. No.: {item.scanData}</Text>
                                        <Text note>{I18n.t('scanTime')}:{item.scanAt.toLocaleString()}</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        }>
                    </List>
                </Content>
            </Container >
        );
    }
}

const styles = StyleSheet.create({
    baseContainer: {
        backgroundColor: ColorConfig.GRAY_BACKGROUND
    },
    header: {
        backgroundColor: ColorConfig.GRAY_HEADER_BACKGROUND
    },
    infoCard: {
        backgroundColor: ColorConfig.WHITE,
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: 10,
        paddingRight: 10
    }
});