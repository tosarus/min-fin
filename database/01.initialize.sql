CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  picture text,
  allowed boolean DEFAULT false,
  active_budget integer
);

CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL,
  name text NOT NULL
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  budget_id integer NOT NULL,
  name text NOT NULL,
  balance bigint NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  budget_id integer NOT NULL,
  name text
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  account_id integer NOT NULL,
  category_id integer,
  description text NOT NULL,
  memo text,
  date date,
  value bigint
);

ALTER TABLE users ADD FOREIGN KEY (active_budget) REFERENCES budgets (id);

ALTER TABLE budgets ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE accounts ADD FOREIGN KEY (budget_id) REFERENCES budgets (id);

ALTER TABLE categories ADD FOREIGN KEY (budget_id) REFERENCES budgets (id);

ALTER TABLE transactions ADD FOREIGN KEY (account_id) REFERENCES accounts (id);

ALTER TABLE transactions ADD FOREIGN KEY (category_id) REFERENCES categories (id);

CREATE UNIQUE INDEX ON users (email);
