import { GetAdByIdQuery } from "../../generated/graphql-types";

interface DetailUserProps {
  ad: GetAdByIdQuery["getAdById"];
}

export default function DetailUser({ ad }: DetailUserProps) {
  return <>Encart user</>;
}
