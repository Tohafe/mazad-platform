import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider"

export default function Profile(){
    const {user} = useAuth();

    const getProfile = () => {

        return <>
            {user && <>
                { user.id && <li>{user.id}</li>}
                { user.username && <li>{user.username}</li>}
                { user.email && <li>{user.email}</li>}
                { user.firstName && <li>{user.firstName}</li>}
                { user.lastName && <li>{user.lastName}</li>}
                { user.bio && <li>{user.bio}</li>}
                { user.avatarUrl && <li>{user.avatarUrl}</li>}
                { user.avatarThambnailUrl && <li>{user.avatarThambnailUrl}</li>}
                { user.phoneNumber && <li>{user.phoneNumber}</li>}
                { user.address && <li>{user.address}</li>}
                { user.city && <li>{user.city}</li>}
                { user.country && <li>{user.country}</li>}
                </>
            }
            </>;
    }

    return (
        <div>
            {getProfile()}
            <Link to='/login' className="text-xl text-brand mr-15">Sign in</Link>
            <Link to='/register' className="text-xl text-brand">Register</Link>
         </div>
    )
}