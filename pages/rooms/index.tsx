import { v1 as uuid } from "uuid";
import { useRouter } from "next/router";

const CreateRoom = () => {
  const router = useRouter();

  function create() {
    const id = uuid();
    router.push(`/room${id}`);
  }

  return <button onClick={create}>Create Room</button>;
};

export default CreateRoom;
