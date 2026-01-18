CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100),
  senha VARCHAR(100),
  tipo ENUM('empresa','prestador')
);

CREATE TABLE solicitacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa VARCHAR(100),
  servico VARCHAR(100),
  status VARCHAR(50)
);
CREATE TABLE empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  ramo VARCHAR(100)
);

CREATE TABLE funcionarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  nome VARCHAR(100)
);

CREATE TABLE documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  tipo ENUM('ASO','TREINAMENTO'),
  status ENUM('valido','vencendo','vencido')
);

CREATE TABLE prestadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  servicos VARCHAR(255),
  regiao VARCHAR(100)
);

ALTER TABLE solicitacoes
ADD prestador_id INT,
ADD empresa_id INT;
ALTER TABLE usuarios ADD COLUMN empresa_id INT;
ALTER TABLE usuarios ADD COLUMN prestador_id INT;
ALTER TABLE documentos
ADD COLUMN arquivo VARCHAR(255);
