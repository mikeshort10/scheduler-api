FROM public.ecr.aws/lambda/nodejs:14

# Copy the Lambda functions
COPY createSchedule.ts package.json package-lock.json tsconfig.json ${LAMBDA_TASK_ROOT}/

# Install NPM dependencies for function
RUN npm install

RUN npm run build

# ENTRYPOINT ["node" ,"-e","'require(`createSchedule.js`).handler'"]

CMD [ "createSchedule.handler" ]

# ENTRYPOINT  ["/lambda-entrypoint.sh"]