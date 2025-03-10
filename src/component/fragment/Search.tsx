import Button from "../element/Button";
import Input from "../element/Input";

export default function Search() {
  return (
    <div className="w-full flex justify-center items-center text-sm relative px-4">
      <form
        action=""
        className="flex gap-2 bg-white p-2 rounded-sm shadow-md shadow-gray-400 absolute -top-10"
      >
        <Input />

        <Button />
      </form>
    </div>
  );
}
