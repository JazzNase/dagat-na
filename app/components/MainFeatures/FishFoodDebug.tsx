import { useAccount, useReadContract } from "wagmi";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../../../contracts/abi";

export function FishFoodDebug() {
  const { address } = useAccount();
  const { data, refetch } = useReadContract({
    abi: DAGAT_NA_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "getFishFoodBalance",
    args: address ? [address] : undefined,
  });

  return (
    <div style={{ margin: "16px 0", padding: "8px", border: "1px solid #eee", borderRadius: "8px" }}>
      <div>Fish Food Balance: {data ? Number(data) : 0}</div>
      <button onClick={() => refetch()} style={{ marginTop: "8px" }}>Refetch</button>
    </div>
  );
}