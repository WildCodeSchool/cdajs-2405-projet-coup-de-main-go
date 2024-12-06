import { useState } from "react";
import NewAdModal from "../components/NewAdModal/NewAdModal";
import { useAuth } from "../contexts/AuthContext";
import { useGetAllUsersQuery } from "../generated/graphql-types";
import { Button } from "@mui/material";

interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  skills: { id: string; name: string }[];
}

function Dashboard() {
  const { logout } = useAuth();
  const [newAdModalIsOpen, setNewAdModalIsOpen] = useState<boolean>(false);
  // Requête Apollo : GetAllUsers
  const { data, error, loading } = useGetAllUsersQuery();

  if (error) {
    return <p>Error : {error.message}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  // Initialisation de la variable users
  const users: UserProps[] = data?.getAllUsers || [];

  return (
    <>
      <h1>JE SUIS LE DASHBOARD</h1>
      <button onClick={() => logout()}>Se déconnecter</button>
      <Button onClick={() => setNewAdModalIsOpen(true)}>
        Créer une annonce
      </Button>
      {newAdModalIsOpen && (
        <NewAdModal
          isModalOpen={newAdModalIsOpen}
          closeModal={() => setNewAdModalIsOpen(false)}
        />
      )}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName}
            <ul>
              {user.skills.map((skill) => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Dashboard;
