/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Schema, Model, Document, DeleteResult,
} from 'mongoose';
import { getOrCreateModel } from '@growi/core';

export interface IPageRedirect {
  fromPath: string,
  toPath: string,
}

export interface PageRedirectDocument extends IPageRedirect, Document {}

export interface PageRedirectModel extends Model<PageRedirectDocument> {
  [x:string]: any // TODO: improve type
}

/**
 * This is the setting for notify to 3rd party tool (like Slack).
 */
const schema = new Schema<PageRedirectDocument, PageRedirectModel>({
  fromPath: {
    type: String, required: true, unique: true, index: true,
  },
  toPath: { type: String, required: true },
});

schema.statics.removePageRedirectByFromPath = async function(fromPath: string): Promise<DeleteResult> {
  return this.deleteOne({ fromPath });
};

export default getOrCreateModel<PageRedirectDocument, PageRedirectModel>('PageRedirect', schema);
