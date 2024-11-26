import { useAuth } from "../contexts/AuthContext";
import { useGetAllUsersQuery } from "../generated/graphql-types";

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
    const { data, error, loading } = useGetAllUsersQuery();

    if (error) {
        return <p>Error : {error.message}</p>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    const users: UserProps[] = data?.getAllUsers || [];

    return (
        <>
            <h1>JE SUIS LE DASHBOARD</h1>
            <button onClick={() => logout()}>Se déconnecter</button>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.firstName} {user.lastName}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Dashboard;
