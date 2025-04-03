
import { z } from 'zod';
import { reportSchema } from '@/hooks/useReportForm';

// Report form types
export type ReportFormValues = z.infer<typeof reportSchema>;
