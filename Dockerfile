FROM node:latest

RUN mkdir parse

ADD . /parse
WORKDIR /parse
RUN npm install

ENV APP_ID=‘JywFR4CxgCLRsb32sksRVA8aLuIuoAlRMqnoqlJV’
ENV MASTER_KEY=‘rNSMQDmGw5eBMFBuP0OOb0KbEWBcv3CJ23YdfU8i’
ENV MONGOLAB_URI=‘mongodb://frazeframetester:Frazeframe123@ds017018-a0.mlab.com:17018/fraze-frame'
ENV DEV_PUSH_CERTIFICATE_PATH=‘./certificates/ParsePushDevCertificate.p12’
ENV PROD_PUSH_CERTIFICATE_PATH=‘./certificates/ParsePushDevCertificate.p12’


# Optional (default : 'parse/cloud/main.js')
# ENV CLOUD_CODE_MAIN cloudCodePath

# Optional (default : '/parse')
# ENV PARSE_MOUNT mountPath

EXPOSE 1337

# Uncomment if you want to access cloud code outside of your container
# A main.js file must be present, if not Parse will not start

# VOLUME /parse/cloud               

CMD [ "npm", "start" ]
