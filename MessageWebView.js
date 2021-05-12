import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

// https://github.com/react-native-community/react-native-webview/releases/tag/v5.0.0
const patchPostMessageJsCode = `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})();`;

export default class MessageWebView extends React.Component {
  constructor(props) {
    super(props);
    this.postMessage = this.postMessage.bind(this);
  }
  postMessage(action) {
    this.WebView.postMessage(JSON.stringify(action));
  }

  getWebViewHandle = () => {
    return this.webview;
  };

  getToken = () => {
    this.webview.injectJavaScript(
      `(function() {
        window.WebViewBridge.onMessage('get token');
      })();`
    );
  };

  render() {
    const { html, source, url, onMessage, ...props } = this.props;

    return (
      <View style={props.containerStyle}>
        <WebView
          {...props}
          style={props.containerStyle}
          javaScriptEnabled
          automaticallyAdjustContentInsets
          injectedJavaScript={patchPostMessageJsCode}
          source={source ? source : html ? { html } : url}
          ref={x => {
            this.webview = x;
          }}
          onMessage={e => onMessage(e.nativeEvent.data)}
        />
      </View>
    );
  }
}
