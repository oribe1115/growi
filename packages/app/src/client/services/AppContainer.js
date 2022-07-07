import { Container } from 'unstated';


import GrowiRenderer, { generatePreviewRenderer } from '~/services/renderer/growi-renderer';

import { i18nFactory } from '../util/i18n';

/**
 * Service container related to options for Application
 * @extends {Container} unstated Container
 */
export default class AppContainer extends Container {

  constructor() {
    super();

    this.config = JSON.parse(document.getElementById('growi-context-hydrate').textContent || '{}');

    // init i18n
    const currentUserElem = document.getElementById('growi-current-user');
    let userLocaleId;
    if (currentUserElem != null) {
      const currentUser = JSON.parse(currentUserElem.textContent);
      userLocaleId = currentUser?.lang;
    }
    this.i18n = i18nFactory(userLocaleId);

    this.containerInstances = {};
    this.componentInstances = {};
  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'AppContainer';
  }

  initApp() {
    this.injectToWindow();
  }

  initContents() {
    const body = document.querySelector('body');

    this.isDocSaved = true;

    const isPluginEnabled = body.dataset.pluginEnabled === 'true';
    if (isPluginEnabled) {
      this.initPlugins();
    }

    this.injectToWindow();
  }

  initPlugins() {
    const growiPlugin = window.growiPlugin;
    growiPlugin.installAll(this);
  }

  injectToWindow() {
    window.appContainer = this;

    window.growiRenderer = new GrowiRenderer(this.getConfig());

    // TODO: Remove this code when reveal.js is omitted. see: https://github.com/weseek/growi/pull/6223
    // Do not access this property from other than reveal.js plugins.
    window.previewRenderer = generatePreviewRenderer();

    // backward compatibility
    window.crowi = this;
    window.crowiRenderer = window.growiRenderer;
    window.crowiPlugin = window.growiPlugin;
  }

  getConfig() {
    return this.config;
  }

  /**
   * Register unstated container instance
   * @param {object} instance unstated container instance
   */
  registerContainer(instance) {
    if (instance == null) {
      throw new Error('The specified instance must not be null');
    }

    const className = instance.constructor.getClassName();

    if (this.containerInstances[className] != null) {
      throw new Error('The specified instance couldn\'t register because the same type object has already been registered');
    }

    this.containerInstances[className] = instance;
  }

  /**
   * Get registered unstated container instance
   * !! THIS METHOD SHOULD ONLY BE USED FROM unstated CONTAINERS !!
   * !! From component instances, inject containers with `import { Subscribe } from 'unstated'` !!
   *
   * @param {string} className
   */
  getContainer(className) {
    return this.containerInstances[className];
  }

  /**
   * Register React component instance
   * @param {string} id
   * @param {object} instance React component instance
   */
  registerComponentInstance(id, instance) {
    if (instance == null) {
      throw new Error('The specified instance must not be null');
    }

    this.componentInstances[id] = instance;
  }

  /**
   * Get registered React component instance
   * @param {string} id
   */
  getComponentInstance(id) {
    return this.componentInstances[id];
  }

}
