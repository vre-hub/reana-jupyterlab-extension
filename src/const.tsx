export const EXTENSION_ID = 'jupyterlab_reana';

export const statusMapping : { [key: string]: any } = {
    finished: { icon: "check_circle", color: "green", preposition: "in" },
    running: { icon: "progress_activity", color: "blue", preposition: "for" },
    failed: { icon: "close", color: "red", preposition: "after" },
    created: { icon: "text_snippet", color: "violet" },
    stopped: {
      icon: "stop_circle",
      color: "yellow",
      preposition: "after",
    },
    queued: { icon: "hourglass", color: "teal" },
    pending: { icon: "hourglass_top", color: "teal" },
    deleted: { icon: "ink_eraser", color: "grey" },
};