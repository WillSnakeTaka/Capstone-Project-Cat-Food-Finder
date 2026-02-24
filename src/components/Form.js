import { useState } from "react";

export default function Form(props) {
  const [formData, setFormData] = useState({
    searchterm: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.moviesearch(formData.searchterm);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="searchterm"
          onChange={handleChange}
          value={formData.searchterm}
          placeholder="Try: Clueless, Inception, Barbie"
        />
        <input type="submit" value="Search" />
      </form>
    </div>
  );
}
