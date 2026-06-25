import { RequestMethod } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import 'dotenv/config';
import { IncomingMessage, ServerResponse } from 'http';
import { nanoid } from 'nanoid';
import { Params } from 'nestjs-pino';
import { GenReqId, ReqId } from 'pino-http';
import { k8s } from './otlp.config';

const isPretty = process.env.PRETTY_LOG === 'true';
const level = process.env.LOG_LEVEL || 'info';

const genReqId: GenReqId = (req: IncomingMessage, res: ServerResponse) => {
  const reqId = req.id as string;

  const xRequestId = req.headers['x-request-id'] as string;
  const id: string = reqId ?? xRequestId ?? nanoid();

  res.setHeader('x-request-id', id);
  return id as ReqId;
};

export const loggerConfig: Params = {
  pinoHttp: {
    level,
    genReqId,
    transport: isPretty ? { target: 'pino-pretty' } : undefined,
    redact: {
      paths: ['res.headers', '[*].remoteAddress', '[*].remotePort'],
      remove: true,
    },
    serializers: {
      req(req: IncomingMessage): Record<string, unknown> {
        return req as unknown as Record<string, unknown>;
      },
    },
    formatters: {
      log(object: Record<string, unknown>): Record<string, unknown> {
        const span = trace.getSpan(context.active());
        const environment = k8s.namespace;
        if (!span) {
          return { ...object, environment };
        }
        const { spanId, traceId } = span.spanContext();
        return { ...object, spanId, traceId, environment };
      },
    },
  },
  exclude: [{ method: RequestMethod.ALL, path: '/health' }],
};
