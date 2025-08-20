import Button from "@/components/Button";
import Input from "@/components/Input";
import SectionHeader from "@/components/SectionHeader";

const EditProduct = () => {
  return (
    <>
      <SectionHeader className="my-10">
        <h2>Edit product</h2>
      </SectionHeader>
      <form className="space-y-10">
        <Input placeholder="name" value="" setValue={() => {}} />
        <Input placeholder="description" value="" setValue={() => {}} />
        <Input placeholder="price" value="" setValue={() => {}} />
        <Input placeholder="ingredients" value="" setValue={() => {}} />
        <div>
          <input
            type="file"
            multiple={false}
            className="z-[99999999999999999999999999999]"
          />
        </div>
        <Button type="primary" className="ml-auto">
          Submit
        </Button>
      </form>
    </>
  );
};

export default EditProduct;
