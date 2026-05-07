import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Spinner from "react-bootstrap/Spinner";
import { parse } from "yaml";

const CatalogContext = createContext();

const CATALOGS = [
  {
    name: "Awesome Labspaces",
    url: "https://raw.githubusercontent.com/dockersamples/awesome-labspaces/refs/heads/main/catalog.yaml",
  },
];

const LOCALSTORAGE_CATALOG_KEY = "labspaces.catalogs";
const LOCALSTORAGE_ADDITIONAL_LABSPACES_KEY = "labspaces.additionalLabspaces";

// Quick backwards compatibility for old local storage keys
if (localStorage.getItem(LOCALSTORAGE_ADDITIONAL_LABSPACES_KEY)) {
  const customLabs = JSON.parse(localStorage.getItem(LOCALSTORAGE_ADDITIONAL_LABSPACES_KEY));

  customLabs.forEach((lab) => {
    if (!lab.catalog) {
      lab.catalog = { url: "custom", name: "Custom Labspaces" };
    }
  });
  
  localStorage.setItem(
    LOCALSTORAGE_ADDITIONAL_LABSPACES_KEY,
    JSON.stringify(customLabs),
  );
}

export function CatalogContextProvider({ children }) {
  const [catalogs, setCatalogs] = useState(
    localStorage.getItem(LOCALSTORAGE_CATALOG_KEY)
      ? JSON.parse(localStorage.getItem(LOCALSTORAGE_CATALOG_KEY))
      : CATALOGS,
  );
  const [catalogDetails, setCatalogDetails] = useState(null);
  const [customLabspaces, setCustomLabspaces] = useState(
    localStorage.getItem(LOCALSTORAGE_ADDITIONAL_LABSPACES_KEY)
      ? JSON.parse(localStorage.getItem(LOCALSTORAGE_ADDITIONAL_LABSPACES_KEY))
      : [],
  );

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_CATALOG_KEY, JSON.stringify(catalogs));
  }, [catalogs]);

  useEffect(() => {
    localStorage.setItem(
      LOCALSTORAGE_ADDITIONAL_LABSPACES_KEY,
      JSON.stringify(customLabspaces),
    );
  }, [customLabspaces]);

  const addCatalog = useCallback(
    ({ name, url, content }) => {
      setCatalogs((catalog) => [...catalog, { name, url, content }]);
    },
    [setCatalogs],
  );

  const removeCatalog = useCallback(
    (url) => {
      setCatalogs((catalogs) => catalogs.filter((c) => c.url !== url));
    },
    [setCatalogs],
  );

  const tags = useMemo(() => {
    if (!catalogDetails) return null;
    const allTags = [];
    catalogDetails.forEach((catalog) => {
      catalog.tags.forEach((tag) => {
        if (!allTags.find((t) => t.label === tag.label)) {
          allTags.push(tag);
        }
      });
    });
    return allTags.sort((a, b) => a.label.localeCompare(b.label));
  }, [catalogDetails]);

  const labspaces = useMemo(() => {
    if (!catalogDetails) return null;
    const allLabspaces = [...customLabspaces];
    catalogDetails.forEach((catalog) => {
      catalog.labspaces.forEach((labspace) => {
        allLabspaces.push({
          ...labspace,
          catalog: { name: catalog.name, url: catalog.url },
        });
      });
    });
    return allLabspaces.sort((a, b) => {
      if (a.highlighted && !b.highlighted) return -1;
      if (!a.highlighted && b.highlighted) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [catalogDetails, customLabspaces]);

  useEffect(() => {
    Promise.all(
      catalogs.map(async (catalog) => {
        let catalogContent;
        if (catalog.content) {
          console.log("Got some content", catalog.content);
          catalogContent = catalog.content;
        } else {
          catalogContent = await fetch(catalog.url).then((res) => res.text());
        }

        const data = parse(catalogContent);
        return {
          ...catalog,
          tags: data.tags || [],
          labspaces: data.labspaces || [],
        };
      }),
    ).then((results) => setCatalogDetails(results));
  }, [catalogs]);

  const addCustomLabspace = useCallback(
    (title, publishedRepo) => {
      const newLabspace = { title, publishedRepo, catalog: { url: "custom", name: "Custom Labspaces" } };
      setCustomLabspaces((labspaces) => [...labspaces, newLabspace]);
    },
    [setCustomLabspaces],
  );

  const removeCustomLabspace = useCallback(
    (publishedRepo) => {
      setCustomLabspaces((labs) =>
        labs.filter((l) => l.publishedRepo !== publishedRepo),
      );
    },
    [setCustomLabspaces],
  );

  const fullCatalogDetails = useMemo(() => {
    if (!catalogDetails || !labspaces) return null;

    const details = [...catalogDetails];
    if (labspaces.filter(l => l.catalog.url === "custom").length > 0) {
      details.push({
        name: "Custom Labspaces",
        url: "custom",
        tags: [],
        labspaces: labspaces.filter(l => l.catalog.url === "custom")
      });
    }
    return details;
  }, [catalogDetails, labspaces]);

  if (!catalogDetails || !labspaces || !tags) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <CatalogContext.Provider
      value={{
        catalogs: fullCatalogDetails,
        addCatalog,
        removeCatalog,
        tags,
        labspaces,
        addCustomLabspace,
        removeCustomLabspace,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export const useCatalogs = () => useContext(CatalogContext);
