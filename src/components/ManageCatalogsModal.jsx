import { useCallback, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { parse } from "yaml";
import { Table } from "react-bootstrap";
import { useCatalogs } from "../CatalogContext";

function validateUrl(url) {
  try {
    new URL(url);
  } catch (e) {
    throw new Error("Invalid URL");
  }
}

async function validateUrlResponse(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch catalog file: ${response.statusText}`);
  }
  return response;
}

async function validateCatalogContent(data) {
  let catalog;
  try {
    catalog = parse(data);
  } catch (e) {
    throw new Error("Fetched file is not valid YAML");
  }

  if (!catalog || !Array.isArray(catalog.labspaces)) {
    throw new Error("Catalog file is missing 'labspaces' content");
  }
  if (!Array.isArray(catalog.tags)) {
    throw new Error("Catalog file is missing 'tags' content");
  }
}

export function ManageCatalogsModal({ show, onClose }) {
  const { catalogs, addCatalog, removeCatalog } = useCatalogs();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [catalogContent, setCatalogContent] = useState("");
  const [error, setError] = useState(null);
  const [showCatalogAdded, setShowCatalogAdded] = useState(false);

  const reset = useCallback(() => {
    setTitle("");
    setUrl("");
    setError(null);
  }, []);

  const validate = useCallback(async (url) => {
    try {
      validateUrl(url);
      const response = await validateUrlResponse(url);
      const data = await response.text();
      await validateCatalogContent(data);

      return true;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!url && !catalogContent) {
      setError("Please provide either a URL or catalog content");
      return;
    }

    if (url) await validate(url);
    else await validateCatalogContent(catalogContent);

    addCatalog({ name: title, url, content: catalogContent });
    setShowCatalogAdded(true);
    reset();
  }

  function handleCancel() {
    onClose();
    reset();
  }

  useEffect(() => {
    if (!showCatalogAdded) return;

    const timer = setTimeout(() => setShowCatalogAdded(false), 5000);
    return () => clearTimeout(timer);
  }, [showCatalogAdded]);

  return (
    <Modal show={show} onHide={handleCancel} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="mb-0">Manage Catalogs</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Table striped bordered hover className="mb-4">
            <thead>
              <tr>
                <th>Title</th>
                <th># of Labspaces</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {catalogs.map((catalog) => (
                <tr key={catalog.url}>
                  <td>{catalog.name}</td>
                  <td>{catalog.labspaces.length}</td>
                  <td>{catalog.url}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeCatalog(catalog.url)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <hr />

          <h4>Add a Catalog</h4>

          <Form.Group className="mb-3" controlId="catalogTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Alert variant="info">
            You can add a catalog by either providing the URL or the content of
            the catalog definition file. If both are provided, the URL will be
            used.
          </Alert>

          <Form.Group className="mb-3" controlId="labspaceComposeFile">
            <Form.Label>Catalog URL</Form.Label>
            <Form.Control
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Form.Text muted>Location of the catalog definition file</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="labspaceComposeFile">
            <Form.Label>Catalog Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={7}
              value={catalogContent}
              onChange={(e) => setCatalogContent(e.target.value)}
            />
            <Form.Text muted>Content of the catalog definition file</Form.Text>
          </Form.Group>

          {showCatalogAdded && (
            <Alert variant="success" onClose={() => setShowCatalogAdded(false)}>
              Catalog added successfully!
            </Alert>
          )}

          {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Add Catalog
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
