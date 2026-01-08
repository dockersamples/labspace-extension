import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { useCatalogs } from "../../CatalogContext";
import { ManageCatalogsModal } from "../ManageCatalogsModal";

export function CatalogSidebar({ onFilterChange }) {
  const { catalogs, tags } = useCatalogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    localStorage.getItem("labspaces.activeCategory") || null,
  );
  const [selectedCatalogs, setSelectedCatalogs] = useState(
    localStorage.getItem("labspaces.selectedCatalogs")
      ? JSON.parse(localStorage.getItem("labspaces.selectedCatalogs"))
      : catalogs.map((c) => c.name),
  );
  const [showManageCatalogsModal, setShowManageCatalogsModal] = useState(false);

  useEffect(() => {
    if (activeCategory)
      localStorage.setItem("labspaces.activeCategory", activeCategory);
    else localStorage.removeItem("labspaces.activeCategory");
  }, [activeCategory]);

  useEffect(() => {
    localStorage.setItem(
      "labspaces.selectedCatalogs",
      JSON.stringify(selectedCatalogs),
    );
  }, [selectedCatalogs]);

  useEffect(() => {
    const filters = [];

    filters.push((l) => selectedCatalogs.includes(l.catalog.name));

    if (searchTerm && searchTerm.length > 0) {
      filters.push(
        (l) =>
          l.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (activeCategory) {
      filters.push((l) => l.tags?.includes(activeCategory));
    }

    onFilterChange(filters);
  }, [searchTerm, activeCategory, selectedCatalogs]);

  return (
    <>
      <div className="mb-5">
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-4" controlId="search-filter">
            <Form.Control
              type="text"
              required
              placeholder="Filter by title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Form>
      </div>

      <div className="mb-5">
        <h5 className="d-flex">
          <div className="me-auto">Categories</div>
          {activeCategory && (
            <Button
              className="ms-2 p-0"
              variant="link"
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              Clear
            </Button>
          )}
        </h5>

        {tags.map((t) => (
          <Form.Check // prettier-ignore
            type="radio"
            id={`tag-filter-${t.name}`}
            label={t.label}
            name="tag-filter"
            onChange={() => setActiveCategory(t.name)}
            checked={activeCategory === t.name}
          />
        ))}
      </div>

      <div className="mb-5">
        <h5 className="d-flex">
          <div
            className="me-auto"
            onDoubleClick={() => setShowManageCatalogsModal(true)}
          >
            Catalogs
          </div>
        </h5>
        {catalogs.map((c, index) => (
          <Form.Check // prettier-ignore
            type="checkbox"
            id={`catalog-filter-${index}`}
            label={`${c.name} (${c.labspaces.length})`}
            name="catalog-filter"
            onChange={() => {
              if (selectedCatalogs.includes(c.name)) {
                setSelectedCatalogs(
                  selectedCatalogs.filter((name) => name !== c.name),
                );
              } else {
                setSelectedCatalogs([...selectedCatalogs, c.name]);
              }
            }}
            checked={selectedCatalogs.includes(c.name)}
          />
        ))}
      </div>

      <ManageCatalogsModal
        show={showManageCatalogsModal}
        onClose={() => setShowManageCatalogsModal(false)}
      />
    </>
  );
}
