export { GoConstTsConfig } from '../schemas';

export interface ConstCommentElement {
  name: string;
  tag?: string;
}

export interface ConstCommentType {
  type: string;
  elements: ConstCommentElement[];
}

export interface ConstTypeTr {
  name: string;
  tr: string;
}

export interface ConstTypeTrs {
  lang: string;
  trs: ConstTypeTr[];
  langJson: string[];
}

export interface ConstType {
  type: string;
  pipe: string;
  langs: ConstTypeTrs[];
  names: string[];
}
