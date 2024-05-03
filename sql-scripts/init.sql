CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(200) NOT NULL,
  email VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(100) NOT NULL,
  accessToken VARCHAR(50) NOT NULL UNIQUE,
  isTaxpayer BOOLEAN NOT NULL DEFAULT FALSE,
  phone VARCHAR(15),
  taxNumber VARCHAR(10),
  iban VARCHAR(34),
  email VARCHAR(100),
  defaultIssuer BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(50) NOT NULL,
  nextService DATE,
  hours INT
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(100) NOT NULL,
  note TEXT,
  hours INT,
  date DATE DEFAULT CURRENT_DATE,
  cost MONEY NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS equipment_has_services (
  id SERIAL PRIMARY KEY NOT NULL,
  equipment_id INTEGER NOT NULL REFERENCES equipment(id),
  services_id INTEGER NOT NULL REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS plots (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(100) NOT NULL,
  note TEXT,
  geojson JSON NOT NULL,
  bbox BOX NOT NULL,
  size INT NOT NULL,
  plotNumber VARCHAR(40) NOT NULL,
  cadastralMunicipality INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY NOT NULL,
  customer_id INT NOT NULL REFERENCES companies(id),
  issuer_id INT NOT NULL REFERENCES companies(id),
  plot_id INT NOT NULL REFERENCES plots(id),
  title VARCHAR(100) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  timeTaken INT NOT NULL DEFAULT 0,
  note TEXT
);

CREATE TABLE IF NOT EXISTS activityType (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(100) NOT NULL
);

CREATE TYPE QuantityType AS ENUM ('price_per_hour', 'price_per_piece', 'price_per_area');

CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY NOT NULL,
  activityType_id INT NOT NULL REFERENCES activityType(id),
  job_id INT NOT NULL REFERENCES jobs(id),
  quantityType QuantityType NOT NULL,
  quantity INT NOT NULL,
  price MONEY NOT NULL,
  totalPrice MONEY NOT NULL,
  isPaid BOOLEAN NOT NULL DEFAULT false,
  dueDate DATE NOT NULL
);