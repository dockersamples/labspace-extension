import { useMemo, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { CatalogSidebar } from "./CatalogSidebar";
import { LabspaceCard } from "../LabspaceCard";

export function LabspaceCatalog({ labspaces, onTriggerAddLabspace }) {
  const [filters, setFilters] = useState([]);

  const filteredLabspaces = useMemo(() => {
    let result = labspaces || [];

    filters.forEach((filter) => {
      result = result.filter(filter);
    });

    return result;
  }, [labspaces, filters]);

  return (
    <Row>
      <Col sm={2}>
        <CatalogSidebar onFilterChange={(filters) => setFilters(filters)} />
      </Col>
      <Col sm={10}>
        <Container fluid>
          <Row>
            {filteredLabspaces.map((labspace) => (
              <Col key={labspace.title} xs={12} sm={6} md={4} className="mb-4">
                <LabspaceCard labspace={labspace} />
              </Col>
            ))}

            {filteredLabspaces.length > 0 && (
              <Col xs={12} sm={6} md={4} className="mb-4">
                <Card style={{ borderStyle: "dashed" }} className="h-100">
                  <Card.Body
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ height: "100%" }}
                  >
                    <Card.Title>Run custom Labspace</Card.Title>
                    <Button variant="primary" onClick={onTriggerAddLabspace}>
                      + Add Labspace
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {filteredLabspaces.length === 0 && (
              <Alert variant={"warning"}>
                No Labspaces were found for the current filters
              </Alert>
            )}
          </Row>
        </Container>
      </Col>
    </Row>
  );
}
