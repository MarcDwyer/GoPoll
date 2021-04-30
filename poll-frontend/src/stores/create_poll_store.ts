import { makeObservable, observable } from "mobx";

export type PollPost = {
  question: string;
  options: string[];
};

export class CreatePollStore {
  question: string = "";
  options: string[] = new Array(7).fill("");

  showing: number = 3;

  constructor() {
    makeObservable(this, {
      question: observable,
      options: observable,
    });
  }
  get isComplete() {
    const filled = this.options.reduce((count, opt) => {
      if (opt.length) count++;
      return count;
    }, 0);

    return Boolean(filled >= 2 && this.question.length);
  }
  get finalize() {
    const { question, options } = this;
    const filteredOpts = options.filter((opt) => opt.length);
    return {
      question,
      options: filteredOpts,
    };
  }
}
