-- ============================================================
-- BRMW - Banco de dados definitivo
-- Compatibilidade: MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS brmw
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE brmw;

-- Para recriar do zero, remova o banco brmw antes de executar
-- este script. Ele nao apaga tabelas existentes automaticamente.

-- ============================================================
-- 1. TIPOS DE USUARIO
-- ============================================================

CREATE TABLE tipo_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    chave VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO tipo_usuario (nome, chave) VALUES
('Administrador', 'ADMIN'),
('Usuario', 'USER');

-- ============================================================
-- 2. USUARIOS
-- A senha deve ser armazenada com hash (bcrypt/Argon2), nunca
-- em texto puro. A permissao deve ser validada no backend.
-- ============================================================

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_usuario_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_tipo
        FOREIGN KEY (tipo_usuario_id) REFERENCES tipo_usuario(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- 3. CURSOS
-- Cada curso pertence ao usuario que o cadastrou.
-- ============================================================

CREATE TABLE curso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_curso_id_usuario (id, usuario_id),
    KEY idx_curso_usuario (usuario_id),
    CONSTRAINT fk_curso_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- 4. TURMAS
-- O curso e a turma devem pertencer ao mesmo usuario.
-- ============================================================

CREATE TABLE turma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    vagas INT UNSIGNED,
    ano_letivo YEAR NOT NULL,
    status ENUM('ATIVA', 'INATIVA', 'ENCERRADA') NOT NULL DEFAULT 'ATIVA',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_turma_id_usuario (id, usuario_id),
    KEY idx_turma_usuario (usuario_id),
    KEY idx_turma_curso_usuario (curso_id, usuario_id),
    CONSTRAINT fk_turma_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_turma_curso_usuario
        FOREIGN KEY (curso_id, usuario_id) REFERENCES curso(id, usuario_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_turma_vagas CHECK (vagas IS NULL OR vagas > 0)
) ENGINE=InnoDB;

-- ============================================================
-- 5. ALUNOS
-- Conforme definido, cada aluno e cadastrado diretamente em
-- uma turma. Nao existe matricula compartilhada entre turmas.
-- ============================================================

CREATE TABLE aluno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    telefone VARCHAR(25),
    data_nascimento DATE,
    codigo_aluno VARCHAR(50),
    status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_aluno_id_turma (id, turma_id),
    UNIQUE KEY uk_aluno_codigo_turma (turma_id, codigo_aluno),
    KEY idx_aluno_turma (turma_id),
    CONSTRAINT fk_aluno_turma
        FOREIGN KEY (turma_id) REFERENCES turma(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- 6. CRITERIOS DE AVALIACAO
-- Cada criterio pertence a uma turma e possui seu proprio peso.
-- ============================================================

CREATE TABLE criterio_avaliacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    nota_min DECIMAL(7,2) NOT NULL DEFAULT 0,
    nota_max DECIMAL(7,2) NOT NULL DEFAULT 10,
    peso DECIMAL(7,2) NOT NULL DEFAULT 1,
    status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
    UNIQUE KEY uk_criterio_id_turma (id, turma_id),
    KEY idx_criterio_turma (turma_id),
    CONSTRAINT fk_criterio_turma
        FOREIGN KEY (turma_id) REFERENCES turma(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_criterio_notas CHECK (nota_max > nota_min),
    CONSTRAINT chk_criterio_peso CHECK (peso > 0)
) ENGINE=InnoDB;

-- ============================================================
-- 7. NIVEIS DE CADA CRITERIO
-- As faixas de pontos devem ser configuradas sem sobreposicao.
-- ============================================================

CREATE TABLE nivel_criterio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    criterio_id INT NOT NULL,
    nome_nivel VARCHAR(100) NOT NULL,
    ponto_min DECIMAL(7,2) NOT NULL,
    ponto_max DECIMAL(7,2) NOT NULL,
    descricao TEXT,
    KEY idx_nivel_criterio (criterio_id),
    CONSTRAINT fk_nivel_criterio
        FOREIGN KEY (criterio_id) REFERENCES criterio_avaliacao(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_nivel_criterio_faixa
        CHECK (ponto_min >= 0 AND ponto_max >= ponto_min)
) ENGINE=InnoDB;

-- ============================================================
-- 8. NIVEIS GERAIS DA TURMA
-- As faixas devem cobrir 0 a 100 sem lacunas ou sobreposicoes.
-- ============================================================

CREATE TABLE nivel_geral (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    percentual_min DECIMAL(5,2) NOT NULL,
    percentual_max DECIMAL(5,2) NOT NULL,
    UNIQUE KEY uk_nivel_geral_id_turma (id, turma_id),
    KEY idx_nivel_geral_turma (turma_id),
    CONSTRAINT fk_nivel_geral_turma
        FOREIGN KEY (turma_id) REFERENCES turma(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_nivel_geral_faixa CHECK (
        percentual_min >= 0 AND percentual_max <= 100
        AND percentual_max >= percentual_min
    )
) ENGINE=InnoDB;

-- ============================================================
-- 9. RECOMPENSAS
-- Cada recompensa e vinculada a um nivel geral da mesma turma.
-- ============================================================

CREATE TABLE recompensa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    nivel_geral_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50),
    status ENUM('ATIVA', 'INATIVA') NOT NULL DEFAULT 'ATIVA',
    UNIQUE KEY uk_recompensa_id_turma_nivel (id, turma_id, nivel_geral_id),
    KEY idx_recompensa_nivel (nivel_geral_id, turma_id),
    CONSTRAINT fk_recompensa_nivel_turma
        FOREIGN KEY (nivel_geral_id, turma_id)
        REFERENCES nivel_geral(id, turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- 10. AVALIACOES
-- usuario_id identifica quem criou/registrou a avaliacao.
-- O backend deve autorizar o dono da turma ou um administrador.
-- ============================================================

CREATE TABLE avaliacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    usuario_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    data_avaliacao DATE NOT NULL,
    observacao TEXT,
    status ENUM('RASCUNHO', 'FINALIZADA') NOT NULL DEFAULT 'RASCUNHO',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_avaliacao_id_turma (id, turma_id),
    KEY idx_avaliacao_turma_data (turma_id, data_avaliacao),
    CONSTRAINT fk_avaliacao_turma
        FOREIGN KEY (turma_id) REFERENCES turma(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_avaliacao_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- 11. CRITERIOS UTILIZADOS EM CADA AVALIACAO
-- Impede usar criterio de outra turma na avaliacao.
-- ============================================================

CREATE TABLE avaliacao_criterio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    avaliacao_id INT NOT NULL,
    turma_id INT NOT NULL,
    criterio_id INT NOT NULL,
    UNIQUE KEY uk_avaliacao_criterio (avaliacao_id, criterio_id),
    UNIQUE KEY uk_avaliacao_criterio_id_turma (id, turma_id),
    KEY idx_avaliacao_criterio_turma (criterio_id, turma_id),
    CONSTRAINT fk_ac_avaliacao
        FOREIGN KEY (avaliacao_id, turma_id)
        REFERENCES avaliacao(id, turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ac_criterio
        FOREIGN KEY (criterio_id, turma_id)
        REFERENCES criterio_avaliacao(id, turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- 12. RESULTADOS INDIVIDUAIS POR CRITERIO
-- Um aluno recebe no maximo uma nota por criterio em cada
-- avaliacao. A nota e validada por triggers abaixo.
-- ============================================================

CREATE TABLE resultado_criterio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    avaliacao_criterio_id INT NOT NULL,
    nota DECIMAL(7,2) NOT NULL,
    comentario TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_resultado_aluno_criterio (aluno_id, avaliacao_criterio_id),
    KEY idx_resultado_avaliacao_criterio (avaliacao_criterio_id, turma_id),
    CONSTRAINT fk_resultado_aluno
        FOREIGN KEY (aluno_id, turma_id)
        REFERENCES aluno(id, turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_resultado_avaliacao_criterio
        FOREIGN KEY (avaliacao_criterio_id, turma_id)
        REFERENCES avaliacao_criterio(id, turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_resultado_nota CHECK (nota >= 0)
) ENGINE=InnoDB;

-- ============================================================
-- 13. HISTORICO DE DESEMPENHO
-- Um registro por aluno em cada avaliacao finalizada.
-- Guarda o percentual e o nivel atingido naquela ocasiao.
-- ============================================================

CREATE TABLE historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    avaliacao_id INT NOT NULL,
    nivel_geral_id INT NOT NULL,
    percentual DECIMAL(5,2) NOT NULL,
    data_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_historico_aluno_avaliacao (aluno_id, avaliacao_id),
    UNIQUE KEY uk_historico_id_turma_nivel (id, turma_id, nivel_geral_id),
    KEY idx_historico_aluno_data (aluno_id, data_registro),
    CONSTRAINT fk_historico_aluno
        FOREIGN KEY (aluno_id, turma_id)
        REFERENCES aluno(id, turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_historico_avaliacao
        FOREIGN KEY (avaliacao_id, turma_id)
        REFERENCES avaliacao(id, turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_historico_nivel
        FOREIGN KEY (nivel_geral_id, turma_id)
        REFERENCES nivel_geral(id, turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_historico_percentual
        CHECK (percentual >= 0 AND percentual <= 100)
) ENGINE=InnoDB;

-- ============================================================
-- 14. RECOMPENSAS CONQUISTADAS
-- A recompensa e concedida automaticamente na finalizacao.
-- UNIQUE impede receber a mesma recompensa duas vezes na turma.
-- ============================================================

CREATE TABLE recompensa_conquistada (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    recompensa_id INT NOT NULL,
    nivel_geral_id INT NOT NULL,
    historico_id INT NOT NULL,
    data_conquista TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_aluno_recompensa (aluno_id, recompensa_id),
    KEY idx_recompensa_conquistada_aluno (aluno_id, turma_id),
    CONSTRAINT fk_rc_aluno
        FOREIGN KEY (aluno_id, turma_id)
        REFERENCES aluno(id, turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_rc_recompensa_nivel
        FOREIGN KEY (recompensa_id, turma_id, nivel_geral_id)
        REFERENCES recompensa(id, turma_id, nivel_geral_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_rc_historico_nivel
        FOREIGN KEY (historico_id, turma_id, nivel_geral_id)
        REFERENCES historico(id, turma_id, nivel_geral_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- 15. OBSERVACOES
-- Podem ser gerais do usuario ou vinculadas a um aluno da turma.
-- ============================================================

CREATE TABLE observacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    aluno_id INT NULL,
    turma_id INT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_observacao_usuario (usuario_id),
    KEY idx_observacao_aluno_turma (aluno_id, turma_id),
    CONSTRAINT fk_observacao_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_observacao_aluno_turma
        FOREIGN KEY (aluno_id, turma_id)
        REFERENCES aluno(id, turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_observacao_vinculo CHECK (
        (aluno_id IS NULL AND turma_id IS NULL)
        OR (aluno_id IS NOT NULL AND turma_id IS NOT NULL)
    )
) ENGINE=InnoDB;

-- ============================================================
-- TRIGGERS: validar nota dentro dos limites do criterio
-- ============================================================

DELIMITER $$

CREATE TRIGGER trg_resultado_nota_insert
BEFORE INSERT ON resultado_criterio
FOR EACH ROW
BEGIN
    DECLARE v_min DECIMAL(7,2);
    DECLARE v_max DECIMAL(7,2);

    SELECT c.nota_min, c.nota_max
      INTO v_min, v_max
      FROM avaliacao_criterio ac
      JOIN criterio_avaliacao c
        ON c.id = ac.criterio_id
       AND c.turma_id = ac.turma_id
     WHERE ac.id = NEW.avaliacao_criterio_id
       AND ac.turma_id = NEW.turma_id;

    IF NEW.nota < v_min OR NEW.nota > v_max THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Nota fora dos limites definidos para o criterio.';
    END IF;
END$$

CREATE TRIGGER trg_resultado_nota_update
BEFORE UPDATE ON resultado_criterio
FOR EACH ROW
BEGIN
    DECLARE v_min DECIMAL(7,2);
    DECLARE v_max DECIMAL(7,2);

    SELECT c.nota_min, c.nota_max
      INTO v_min, v_max
      FROM avaliacao_criterio ac
      JOIN criterio_avaliacao c
        ON c.id = ac.criterio_id
       AND c.turma_id = ac.turma_id
     WHERE ac.id = NEW.avaliacao_criterio_id
       AND ac.turma_id = NEW.turma_id;

    IF NEW.nota < v_min OR NEW.nota > v_max THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Nota fora dos limites definidos para o criterio.';
    END IF;
END$$

DELIMITER ;

-- ============================================================
-- PROCEDURE: finalizar avaliacao
-- 1. Confere se todos os alunos possuem nota em todos os criterios.
-- 2. Calcula percentual ponderado (notas normalizadas).
-- 3. Identifica exatamente um nivel geral por aluno.
-- 4. Grava historico.
-- 5. Concede recompensas ligadas ao nivel alcancado.
-- 6. Finaliza a avaliacao.
--
-- Execute: CALL finalizar_avaliacao(ID_DA_AVALIACAO);
-- Chame fora de uma transacao ja aberta pela aplicacao.
-- ============================================================

DELIMITER $$

CREATE PROCEDURE finalizar_avaliacao(IN p_avaliacao_id INT)
BEGIN
    DECLARE v_turma_id INT DEFAULT NULL;
    DECLARE v_status VARCHAR(20);
    DECLARE v_alunos INT DEFAULT 0;
    DECLARE v_criterios INT DEFAULT 0;
    DECLARE v_resultados INT DEFAULT 0;
    DECLARE v_sem_nivel INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    IF NOT EXISTS (
        SELECT 1 FROM avaliacao WHERE id = p_avaliacao_id
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Avaliacao nao encontrada.';
    END IF;

    SELECT turma_id, status
      INTO v_turma_id, v_status
      FROM avaliacao
     WHERE id = p_avaliacao_id
     FOR UPDATE;

    IF v_status = 'FINALIZADA' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Esta avaliacao ja foi finalizada.';
    END IF;

    SELECT COUNT(*) INTO v_alunos
      FROM aluno
     WHERE turma_id = v_turma_id
       AND status = 'ATIVO';

    SELECT COUNT(*) INTO v_criterios
      FROM avaliacao_criterio
     WHERE avaliacao_id = p_avaliacao_id
       AND turma_id = v_turma_id;

    IF v_alunos = 0 OR v_criterios = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A avaliacao precisa ter alunos ativos e criterios.';
    END IF;

    SELECT COUNT(*) INTO v_resultados
      FROM resultado_criterio rc
      JOIN avaliacao_criterio ac
        ON ac.id = rc.avaliacao_criterio_id
       AND ac.turma_id = rc.turma_id
     WHERE ac.avaliacao_id = p_avaliacao_id
       AND ac.turma_id = v_turma_id
       AND EXISTS (
           SELECT 1
             FROM aluno a
            WHERE a.id = rc.aluno_id
              AND a.turma_id = rc.turma_id
              AND a.status = 'ATIVO'
       );

    IF v_resultados <> (v_alunos * v_criterios) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Existem notas pendentes para alunos ou criterios.';
    END IF;

    -- Verifica se cada aluno se enquadra em exatamente um nivel.
    WITH desempenho AS (
        SELECT
            rc.aluno_id,
            SUM(
                ((rc.nota - c.nota_min) /
                 (c.nota_max - c.nota_min)) * c.peso
            ) / SUM(c.peso) * 100 AS percentual
        FROM resultado_criterio rc
        JOIN avaliacao_criterio ac
          ON ac.id = rc.avaliacao_criterio_id
         AND ac.turma_id = rc.turma_id
        JOIN criterio_avaliacao c
          ON c.id = ac.criterio_id
         AND c.turma_id = ac.turma_id
        JOIN aluno a
          ON a.id = rc.aluno_id
         AND a.turma_id = rc.turma_id
        WHERE ac.avaliacao_id = p_avaliacao_id
          AND ac.turma_id = v_turma_id
          AND a.status = 'ATIVO'
        GROUP BY rc.aluno_id
    )
    SELECT COUNT(*) INTO v_sem_nivel
    FROM desempenho d
    WHERE (
        SELECT COUNT(*)
        FROM nivel_geral ng
        WHERE ng.turma_id = v_turma_id
          AND d.percentual >= ng.percentual_min
          AND d.percentual <= ng.percentual_max
    ) <> 1;

    IF v_sem_nivel > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Configure faixas de nivel sem lacunas ou sobreposicoes.';
    END IF;

    -- Salva o percentual e o nivel de cada aluno.
    INSERT INTO historico (
        aluno_id, turma_id, avaliacao_id, nivel_geral_id, percentual
    )
    WITH desempenho AS (
        SELECT
            rc.aluno_id,
            SUM(
                ((rc.nota - c.nota_min) /
                 (c.nota_max - c.nota_min)) * c.peso
            ) / SUM(c.peso) * 100 AS percentual
        FROM resultado_criterio rc
        JOIN avaliacao_criterio ac
          ON ac.id = rc.avaliacao_criterio_id
         AND ac.turma_id = rc.turma_id
        JOIN criterio_avaliacao c
          ON c.id = ac.criterio_id
         AND c.turma_id = ac.turma_id
        JOIN aluno a
          ON a.id = rc.aluno_id
         AND a.turma_id = rc.turma_id
        WHERE ac.avaliacao_id = p_avaliacao_id
          AND ac.turma_id = v_turma_id
          AND a.status = 'ATIVO'
        GROUP BY rc.aluno_id
    )
    SELECT
        d.aluno_id,
        v_turma_id,
        p_avaliacao_id,
        ng.id,
        ROUND(d.percentual, 2)
    FROM desempenho d
    JOIN nivel_geral ng
      ON ng.turma_id = v_turma_id
     AND d.percentual >= ng.percentual_min
     AND d.percentual <= ng.percentual_max;

    -- Concede as recompensas associadas ao nivel alcancado.
    INSERT IGNORE INTO recompensa_conquistada (
        aluno_id, turma_id, recompensa_id,
        nivel_geral_id, historico_id
    )
    SELECT
        h.aluno_id,
        h.turma_id,
        r.id,
        h.nivel_geral_id,
        h.id
    FROM historico h
    JOIN recompensa r
      ON r.turma_id = h.turma_id
     AND r.nivel_geral_id = h.nivel_geral_id
     AND r.status = 'ATIVA'
    WHERE h.avaliacao_id = p_avaliacao_id;

    UPDATE avaliacao
       SET status = 'FINALIZADA'
     WHERE id = p_avaliacao_id;

    COMMIT;
END$$

DELIMITER ;

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
