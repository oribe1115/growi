import { isServer } from '@growi/core';
import { Container } from 'unstated';

import { apiv3Get, apiv3Put } from '../util/apiv3-client';

/**
 * Service container for admin markdown setting page (MarkDownSetting.jsx)
 * @extends {Container} unstated Container
 */
export default class AdminMarkDownContainer extends Container {

  constructor(appContainer) {
    super();

    if (isServer()) {
      return;
    }

    this.appContainer = appContainer;

    this.state = {
      retrieveError: null,
      isEnabledLinebreaks: false,
      isEnabledLinebreaksInComments: false,
      adminPreferredIndentSize: 4,
      isIndentSizeForced: false,
      pageBreakSeparator: 1,
      pageBreakCustomSeparator: '',
      isEnabledXss: false,
      xssOption: '',
      tagWhiteList: '',
      attrWhiteList: '{}',
    };

    this.switchEnableXss = this.switchEnableXss.bind(this);
    this.setAdminPreferredIndentSize = this.setAdminPreferredIndentSize.bind(this);
  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'AdminMarkDownContainer';
  }

  /**
   * retrieve markdown data
   */
  async retrieveMarkdownData() {
    const response = await apiv3Get('/markdown-setting/');
    const { markdownParams } = response.data;

    this.setState({
      isEnabledLinebreaks: markdownParams.isEnabledLinebreaks,
      isEnabledLinebreaksInComments: markdownParams.isEnabledLinebreaksInComments,
      adminPreferredIndentSize: markdownParams.adminPreferredIndentSize,
      isIndentSizeForced: markdownParams.isIndentSizeForced,
      pageBreakSeparator: markdownParams.pageBreakSeparator,
      pageBreakCustomSeparator: markdownParams.pageBreakCustomSeparator || '',
      isEnabledXss: markdownParams.isEnabledXss,
      xssOption: markdownParams.xssOption,
      tagWhiteList: markdownParams.tagWhiteList || '',
      attrWhiteList: markdownParams.attrWhiteList || '',
    });
  }

  setAdminPreferredIndentSize(adminPreferredIndentSize) {
    this.setState({ adminPreferredIndentSize });
  }

  /**
   * Switch PageBreakSeparator
   */
  switchPageBreakSeparator(pageBreakSeparator) {
    this.setState({ pageBreakSeparator });
  }

  /**
   * Set PageBreakCustomSeparator
   */
  setPageBreakCustomSeparator(pageBreakCustomSeparator) {
    this.setState({ pageBreakCustomSeparator });
  }

  /**
   * Switch enableXss
   */
  switchEnableXss() {
    this.setState({ isEnabledXss: !this.state.isEnabledXss });
  }

  /**
   * Update LineBreak Setting
   */
  async updateLineBreakSetting() {

    const response = await apiv3Put('/markdown-setting/lineBreak', {
      isEnabledLinebreaks: this.state.isEnabledLinebreaks,
      isEnabledLinebreaksInComments: this.state.isEnabledLinebreaksInComments,
    });

    return response;
  }

  /**
   * Update
   */
  async updateIndentSetting() {

    const response = await apiv3Put('/markdown-setting/indent', {
      adminPreferredIndentSize: this.state.adminPreferredIndentSize,
      isIndentSizeForced: this.state.isIndentSizeForced,
    });

    return response;
  }

  /**
   * Update Xss Setting
   */
  async updateXssSetting() {
    let { tagWhiteList } = this.state;
    const { attrWhiteList } = this.state;

    tagWhiteList = Array.isArray(tagWhiteList) ? tagWhiteList : tagWhiteList.split(',');

    try {
      // Check if parsing is possible
      JSON.parse(attrWhiteList);
    }
    catch (err) {
      throw Error(err);
    }

    await apiv3Put('/markdown-setting/xss', {
      isEnabledXss: this.state.isEnabledXss,
      xssOption: this.state.xssOption,
      tagWhiteList,
      attrWhiteList: attrWhiteList ?? '{}',
    });
  }

  /**
   * Update Presentation Setting
   */
  async updatePresentationSetting() {

    const response = await apiv3Put('/markdown-setting/presentation', {
      pageBreakSeparator: this.state.pageBreakSeparator,
      pageBreakCustomSeparator: this.state.pageBreakCustomSeparator,
    });

    this.setState({
      pageBreakSeparator: response.data.presentationParams.pageBreakSeparator,
      pageBreakCustomSeparator: response.data.presentationParams.pageBreakCustomSeparator,
    });
    return response;
  }

}
