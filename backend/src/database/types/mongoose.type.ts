import { HydratedDocument } from 'mongoose';
import { FormConfig } from 'src/modules/form-config/schema/form-config.schema';
import { Submission } from 'src/modules/submissions/schema/submission.schema';

export type FormConfigDocument = HydratedDocument<FormConfig>;
export type SubmissionDocument = HydratedDocument<Submission>;
