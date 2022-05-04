FROM public.ecr.aws/lambda/nodejs:14

# Copy the Lambda functions
COPY createSchedule.ts package.json package-lock.json tsconfig.json copyClingoToJs.js ${LAMBDA_TASK_ROOT}/

COPY utils ${LAMBDA_TASK_ROOT}/utils

COPY clingo ${LAMBDA_TASK_ROOT}/clingo

COPY types ${LAMBDA_TASK_ROOT}/types


# Install NPM dependencies for function
RUN npm install

RUN npm run copy-clingo

RUN npm run build

CMD [ "createSchedule.handler" ]
