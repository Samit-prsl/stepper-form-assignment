import { SubmissionSchema } from "./submission.schema";

SubmissionSchema.index({
  status: 1,
  updatedAt: -1,
});

SubmissionSchema.index({
  createdAt: -1,
});
