// vendors
import React, { useState, useEffect, FormEvent } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

// components
import logImage from "../../assets/logo.svg";
import api from "../../services/api";

// styles
import { Title, Form, Repositories, Error } from "./styles";

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState("");
  const [errForm, setErrForm] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      "@FIRST-PROJECT-REACT:repositories"
    );

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "@FIRST-PROJECT-REACT:repositories",
      JSON.stringify(repositories)
    );
  }, [repositories]);

  async function addRepository(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setErrForm("Digite o autor/nome do repositório.");
      return;
    }
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);
      const repository = response.data;
      setRepositories([...repositories, repository]);
      setNewRepo("");
      setErrForm("");
    } catch (err) {
      setErrForm("Digite um autor/nome valido");
    }
  }

  return (
    <>
      <img src={logImage} alt={"Github Explorer"} />
      <Title>Explore repositórios no Github</Title>
      <Form onErr={!!errForm} onSubmit={addRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          type="text"
          placeholder="Digite aqui."
        ></input>
        <button type="submit">Pesquisar</button>
      </Form>
      {errForm && <Error>{errForm}</Error>}
      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
