FROM postgres:15

RUN apt-get update && apt-get install -y git make g++ postgresql-server-dev-15 \
  && git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git \
  && cd pgvector && make && make install \
  && cd .. && rm -rf pgvector && apt-get clean
