export const EXTENSION_ID = 'reana_jupyterlab';

export const PAGE_SIZE = 5;
export const WORKSPACE_PAGE_SIZE = 8;
export const MAX_PAGES = 3;

export const WORKFLOW_STATUSES = [
  "created",
  "deleted",
  "failed",
  "finished",
  "pending",
  "queued",
  "running",
  "stopped",
];

export const NON_FINISHED_STATUSES = [
  "created",
  "pending",
  "queued",
  "running",
];

export const statusMapping : { [key: string]: any } = {
    finished: { icon: "check_circle", color: "var(--green)", preposition: "in" },
    running: { icon: "progress_activity", color: "var(--blue)", preposition: "for" },
    failed: { icon: "close", color: "var(--red)", preposition: "after" },
    created: { icon: "draft", color: "var(--violet)" },
    stopped: {
      icon: "stop_circle",
      color: "var(--yellow)",
      preposition: "after",
    },
    queued: { icon: "hourglass", color: "var(--teal)" },
    pending: { icon: "hourglass_top", color: "var(--teal)" },
    deleted: { icon: "ink_eraser", color: "var(--gray)" },
};