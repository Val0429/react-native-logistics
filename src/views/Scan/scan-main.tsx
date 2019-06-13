import React, { Component } from 'react';
import { StyleSheet, NativeModules, DeviceEventEmitter, Vibration } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Button, Icon, Left, Body, Right, Title, Card, CardItem, Footer, FooterTab, Item, Grid, Row, Badge } from 'native-base';
import AppCore from "../../helpers/core.service";
import UserService from '../../helpers/user.service';
import AlertHelper from '../../helpers/alert.helper';
import { ScanEvent, ScanEventType, Location, ScanEventExceptionType } from '../../domain/core';
import ColorConfig from '../../config/color.config';
import QRCodeScanner from 'react-native-qrcode-scanner';
import autobind from 'class-autobind';
import Parse from 'parse/react-native';
import { ConfigKeys } from '../../domain/storage';
import I18n from 'react-native-i18n'


interface Props {
    navigation: any;
    packageLimit: number;
}
interface State {
    locationObj: Location;
    activeFooterIndex: number;
    currentOrder?: ScanEvent;
    currentPackage: ScanEvent[];
    scannedPackage: PackageQRCode[]; // 紀錄已掃描過的箱子QRCode
    errorStatus:number
}

interface PackageQRCode {
    manufactureOrder: string; // 製令單號
    quantity: number;
    sequenceNo: string;
}

export default class ScanMain extends Component<Props, State> {
    static defaultProps = {
        packageLimit: 128
    }
    count:number =0;
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            locationObj: this.props.navigation.state.params.locationObj,
            activeFooterIndex: 1,
            currentPackage: [],
            scannedPackage: [],
            errorStatus :0
        };

        AppCore.getStorage(ConfigKeys.scanEvent)
            .then(result => console.log(result))
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
                        <Title>{I18n.t('scan')}</Title>
                    </Body>
                    <Right>
                        {/* <Button badge
                            transparent
                            onPress={() => this.testScanOrder()}>
                            <Icon style={{ fontSize: 30 }} name='sc-telegram' />
                        </Button>
                        <Button badge
                            transparent
                            onPress={() => this.testScanPackage()}>
                            <Icon style={{ fontSize: 30 }} name='ios-american-football' />
                        </Button> */}

                        <Button badge
                            transparent
                            onPress={() => this.clickLocalOrder()}>
                            {/* {AppCore.getLocalOrderCount() > 0 && <Badge><Text>{AppCore.getLocalOrderCount()}</Text></Badge>} */}
                            <Icon style={{ fontSize: 30 }} name='cloud-upload' />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                    scrollEnabled={false}>
                    <Item style={{flex: 1,paddingLeft: 10,paddingRight: 10,backgroundColor: ColorConfig.WHITE, borderBottomWidth: 0,
                        borderTopWidth: 0,borderLeftWidth: 0, borderRightWidth: 0}}>
                        <Body style={{alignItems: 'flex-start'}}>
                            <Text style={{fontSize:30}}>{I18n.t('location')}:{this.state.locationObj.name}</Text>
                        </Body>
                        <Right>
                            <Button
                                transparent
                                onPress={() => this.clickRecord()}>
                                <Icon style={styles.infoCardIcon} name='list' />
                            </Button>
                        </Right>
                    </Item>
                    {/* <Item style={{flex: 2,paddingLeft: 10,paddingRight: 10,backgroundColor: ColorConfig.GRAY_BACKGROUND,
                        borderBottomWidth: 0,borderTopWidth: 0,borderLeftWidth: 0,borderRightWidth: 0}}>
                        <Body style={{alignItems: 'flex-start'}}>
                            <Text style={{fontSize:35}}>{I18n.t('packageNo')}:</Text>
                            <Text style={{fontSize:35}}>{this.state.currentPackage.length}</Text>
                        </Body>
                      
                    </Item>
                   */}
                    <Item style={{flex: 2,paddingLeft: 10,paddingRight: 10,backgroundColor: ColorConfig.GRAY_BACKGROUND,
                     borderBottomWidth: 0,borderTopWidth: 0,borderLeftWidth: 0,borderRightWidth: 0}}>
                        <Body style={{alignItems: 'flex-start'}}>
                            <Text style={{fontSize:35}}>{I18n.t('orderSingleNo')} :</Text>
                            <Text style={{fontSize:35}}>{this.state.currentOrder ? this.state.currentOrder.scanData : '00000000'}</Text>

                        </Body>
                    </Item>
             
                    <Item style={{flex: 4,paddingLeft: 10,paddingRight: 10,backgroundColor: ColorConfig.GRAY_BACKGROUND,
                        borderBottomWidth: 0,borderTopWidth: 0,borderLeftWidth: 0,borderRightWidth: 0}}>
                        <Content  scrollEnabled={false} contentContainerStyle={{ flex: 1,justifyContent: 'flex-start',alignItems: 'center'}}>
                        { this.state.scannedPackage.length==0 &&
                             <Item style={{flex: 1,paddingLeft: 10,paddingRight: 10,backgroundColor: ColorConfig.WHITE,width:'95%',
                             borderBottomWidth: 0,borderTopWidth: 0,borderLeftWidth: 0,borderRightWidth: 0}}>
                             <Body style={{alignItems: 'center'}}>
                                <Text style={{fontSize:35}}>{I18n.t('pleaseScan') }  </Text>
                                <Text style={{fontSize:40}}>{ this.state.activeFooterIndex==1 ? I18n.t('orderSingleNo') :I18n.t('orderNo')}</Text>
                             </Body>
                         </Item>
                        }
                         { this.state.scannedPackage.length!=0 &&
                             <Item style={{flex: 1,paddingLeft: 10,paddingRight: 10,backgroundColor: ColorConfig.WHITE,width:'95%',
                             borderBottomWidth: 0,borderTopWidth: 0,borderLeftWidth: 0,borderRightWidth: 0}}>
                                <Body style={{alignItems: 'center'}}>
                                    <Text style={{fontSize:35}}>{I18n.t('packageQty') }  </Text>
                                    <Text style={{fontSize:40}}>{  this.state.scannedPackage.length }</Text>
                                </Body>
                            </Item>
                        }
                         { this.state.scannedPackage.length!=0 && this.state.errorStatus ==1 &&
                             <Item style={{flex: 1,paddingLeft: 10,paddingRight: 10,backgroundColor: ColorConfig.WHITE,width:'95%',
                             borderBottomWidth: 0,borderTopWidth: 0,borderLeftWidth: 0,borderRightWidth: 0}}>
                                <Body style={{alignItems: 'center'}}>
                                    <Text style={{fontSize:35,color:ColorConfig.RED}}>{I18n.t('thisQRCodeHasBeenScanned') }  </Text>
                                    <Text style={{fontSize:35,color:ColorConfig.RED}}>{ I18n.t('pleaseScanAgain') }</Text>
                                </Body>
                            </Item>
                        }
                           
                          
                        </Content> 
                    </Item>
                   
 
                </Content>
                <Footer>
                    <FooterTab style={{alignItems: 'center', backgroundColor: ColorConfig.GRAY_BUTTON_BACKGROUND}}>
                        <Button style={{backgroundColor: ColorConfig.TRANSPARENT}}
                            active={this.state.activeFooterIndex === 1}
                            onPress={this.clickOrder}>
                            <Text style={[styles.footerButtonText, this.state.activeFooterIndex === 1 && styles.footerActiveButtonText]}> {I18n.t('order')}</Text>
                        </Button>
                        <Icon style={styles.footerArrow} name='md-arrow-dropright' />
                        <Button style={{backgroundColor: ColorConfig.TRANSPARENT}}
                            active={this.state.activeFooterIndex === 2}>
                            <Text style={[styles.footerButtonText, this.state.activeFooterIndex === 2 && styles.footerActiveButtonText]}>{I18n.t('package')}</Text>
                        </Button>
                        <Icon style={styles.footerArrow} name='md-arrow-dropright' />
                        <Button style={{backgroundColor: ColorConfig.TRANSPARENT}}
                            active={this.state.activeFooterIndex === 3}
                            onPress={this.clickSubmit}>
                            <Text style={[styles.footerButtonText, this.state.activeFooterIndex === 3 && styles.footerActiveButtonText]}>{I18n.t('submit')}</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }

    onScanSuccess(e) {
        switch (this.state.activeFooterIndex) {
            case 1: this.scanOrder(e.data); break;
            case 2: this.scanPackage(e.data); break;
        }
    }

    scanOrder(scanData: string) {
        this.setState({ currentOrder: this.newScanEvent({ type: ScanEventType.ORDER, scanData: scanData }), activeFooterIndex: 2 });
    }

    scanPackage(scanData: string) {
        const seq = scanData.split('|'); // 拆解製令QRCode
        if (seq.length === 3 && this.state.currentPackage.length < this.props.packageLimit) {

            const newPkg: PackageQRCode = {
                manufactureOrder: seq[0],
                quantity: Number(seq[1]),
                sequenceNo: seq[2]
            };

            // If scan the same QRCode, display toast alert and skip it
            if (this.state.scannedPackage.some(x => x.sequenceNo === newPkg.sequenceNo)) {
                //AlertHelper.displayToast(I18n.t('thisQRCodeHasBeenScanned'));
                this.setState({ errorStatus: 1});
                this.vibrationFun();
                setTimeout(() => {
                    this.setState({ errorStatus: 0});

                }, 2000);
                return;
            }

            const newScan = this.newScanEvent({ type: ScanEventType.GOODS, parent: this.state.currentOrder, scanData: scanData });
            const currentPackageTemp = this.state.currentPackage.slice();
            currentPackageTemp.push(newScan);

            const scannedPackageTemp = this.state.scannedPackage.slice();
            scannedPackageTemp.push(newPkg);

            this.setState({ currentPackage: currentPackageTemp, scannedPackage: scannedPackageTemp });
        }
    }

    newScanEvent(args: { type?: string, parent?: ScanEvent, scanData?: string }) {
        const result = new ScanEvent();
        result.user = UserService.currentUser;
        result.type = args.type;
        result.parent = args.parent;
        result.location = this.state.locationObj;
        result.scanAt = new Date();
        result.status = undefined;
        result.scanData = args.scanData;
        return result;
    }

    resetCurrentOrder() {
        this.setState({ currentOrder: undefined, currentPackage: [], scannedPackage: [], activeFooterIndex: 1 });
    }

    clickOrder() {
        if (this.state.activeFooterIndex > 1) {
            AlertHelper.alertObj.alert(
                I18n.t('alertMessage'),
                I18n.t('DoYouWishToCancelCurrentOrder'),
                [
                    { text: I18n.t('yes'), onPress: this.submitCancelRecord },
                    { text: I18n.t('cancel'), onPress: null }
                ],
                { cancelable: false }
            )
        }
    }
    testScanOrder()
    {
        this.scanOrder("123234566");
    }
    testScanPackage()
    {
        if (this.count!=10)
        {
            var tmp = "6C54443455677887" + (this.count+1).toString();
            this.count ++;
        }
        else
        var tmp = "6C54443455677887" + (this.count).toString();

        this.scanPackage("G123456789|1000|"+tmp);
    }
    clickRecord() {
        const errorMsg = this.checkScanError();
        if (errorMsg.length > 0) {
            AlertHelper.alertError(errorMsg);
        } else {

            this.props.navigation.navigate('ScanRecord', { currentOrder: this.state.currentOrder, currentPackage: this.state.currentPackage });
        }
    }

    componentDidMount() {
        NativeModules.RNBarCodeScanner.StartScan();
        DeviceEventEmitter.addListener(
                         'notificationReceived',
                         this.onNotificationReceived);
    }
    componentWillUnmount() {
        NativeModules.RNBarCodeScanner.StopScan();
        DeviceEventEmitter.removeListener(
                            'notificationReceived',
                            this.onNotificationReceived);
    }
    onNotificationReceived(e) {
        console.log("Got message: " + e.scanData);
        switch (this.state.activeFooterIndex) {
            case 1:
                this.scanOrder(e.scanData);
                break;
            case 2:
                this.scanPackage(e.scanData);
                break;
        }
    }


    clickSubmit() {
        const errorMsg = this.checkScanError();
        if (errorMsg.length > 0) {
            AlertHelper.alertError(errorMsg);
        } else {
            AlertHelper.alertObj.alert(
                I18n.t('alertMessage'),
                I18n.t('readyToSubmit'),
                [
                    { text: I18n.t('yes'), onPress: () => this.submitCompleteRecord() },
                    { text: I18n.t('cancel'), onPress: null }
                ],
                { cancelable: false }
            )
        }
    }

    clickLocalOrder() {
        if (AppCore.getLocalOrderCount() > 0) {
            AlertHelper.alertObj.alert(
                I18n.t('alertMessage') ,
                I18n.t('tryToSubmitAllLocalOrder'),
                [
                    { text: I18n.t('yes'), onPress: () => AppCore.submitCurrentScanEvent() },
                    { text: I18n.t('cancel'), onPress: null }
                ],
                { cancelable: false }
            )
        } else {
            AlertHelper.alertError(I18n.t('NoLocalScanEvent'));
        }
    }

    // 一般完成submit操作
    submitCompleteRecord() {
        this.insertCompleteEvent();
        this.submitRecord()
    }

    // 取消order操作
    submitCancelRecord() {
        if (this.state.currentOrder) {
            const tempOrder = this.state.currentOrder;
            tempOrder.status = ScanEventExceptionType.CANCEL_PACKAGING;
            this.setState({ currentOrder: tempOrder });
            this.insertCancelEvent();
            this.submitRecord();
        }
    }

    submitRecord() {
        let submitScanEvents = [];
        submitScanEvents.push(this.state.currentOrder);
        submitScanEvents = submitScanEvents.concat(this.state.currentPackage);

        AppCore.submitCurrentScanEvent(submitScanEvents);
        this.resetCurrentOrder();
    }

    /** 在一般完成狀況下，額外新增完成event */
    insertCompleteEvent() {
        if (!this.state.currentPackage.some(x => x.type === ScanEventType.COMPLETE)) {
            const completeEvent = this.newScanEvent({ type: ScanEventType.COMPLETE, parent: this.state.currentOrder });
            const currentPackageTemp = this.state.currentPackage.slice();
            currentPackageTemp.push(completeEvent);
            this.setState({ currentPackage: currentPackageTemp, activeFooterIndex: 3 });
        }
    }

    insertCancelEvent() {
        if (!this.state.currentPackage.some(x => x.type === ScanEventType.CANCEL)) {
            const cancelEvent = this.newScanEvent({ type: ScanEventType.CANCEL, parent: this.state.currentOrder });
            const currentPackageTemp = this.state.currentPackage.slice();
            currentPackageTemp.push(cancelEvent);
            this.setState({ currentPackage: currentPackageTemp, activeFooterIndex: 3 });
        }
    }

    /** 檢查目前是否有order及package, 使用在UI點擊submit或觀看已掃描清單 */
    checkScanError(): string {
        const result = [];
        if (!this.state.currentOrder) {
            result.push(I18n.t('PleaseScanOrderFirst'));
        }
        if (!this.state.currentPackage || this.state.currentPackage.length === 0) {
            result.push(I18n.t('NoPackageScanned'))
        }
        return result.join('\n');
    }
    vibrationFun(){
        const PATTERN = [1000, 2000, 3000];
        Vibration.vibrate(PATTERN,true)
    
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
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: ColorConfig.WHITE
    },
    infoCardBody: {
        alignItems: 'flex-start',
    },
    infoCardIcon: {
        color: ColorConfig.GRAY_BUTTON_BACKGROUND,
        fontSize: 30
    },
    scanScreen: {
        flex: 6,
        backgroundColor: 'rgba(255, 255, 255, 0)'
    },
    footerContainer: {
        alignItems: 'center',
        backgroundColor: ColorConfig.GRAY_BUTTON_BACKGROUND
    },
    footerArrow: {
        color: ColorConfig.YELLOW_MAIN_THEME
    },
    footerButton: {
        backgroundColor: ColorConfig.TRANSPARENT
    },
    footerButtonText: {
        color: ColorConfig.WHITE,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize:18
    },
    footerActiveButtonText: {
        color: ColorConfig.YELLOW_MAIN_THEME,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize:18
    }
});