import { useEffect, useRef,useState } from "react";
import { Drawer, Box } from "@mui/material";
export default function PdfViewerComponent(props) {
  const containerRef = useRef(null);
  let PSPDFKit;
  let instantJSON;
  let inst;
    const [drawerOpenBottom, setDrawerOpenBottom] = useState(false);
    const [drawerOpenRight, setDrawerOpenRight] = useState(false);
    const [annotateID, setAnnotateID] = useState({
      id: "",
      index: "",
    });
    const [page, setPage] = useState(0);
    const toggleDrawer = (open, anchor) => (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      if (anchor === "rt") {
        setDrawerOpenRight(open);
      } else {
        setDrawerOpenBottom(open);
      }
    };
    const handleClick = () => {
      console.log("annotateID.index", annotateID.index);
      setPage(Number(annotateID.index));
    };
  useEffect(() => {
    const container = containerRef.current;
    const loadJson = JSON.parse(localStorage.getItem("Annotation"));
    (async function () {
      PSPDFKit = await import("pspdfkit");
      const toolbarItems = PSPDFKit.defaultToolbarItems.filter((item) => {
        return /\b(pan|annotate|zoom-in|zoom-out|rectangle)\b/.test(item.type);
      });
      toolbarItems.push({
        type: "custom",
        id: "my-custom-button",
        title: "Save",
        onPress: async function () {
          instantJSON = await inst.exportInstantJSON();
          console.log(instantJSON);
          localStorage.setItem("Annotation", JSON.stringify(instantJSON));
          //api call
          console.log("api call");
        },
      });
      await PSPDFKit.load({
        container,
        document: props.document,
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
        toolbarItems: toolbarItems,
        instantJSON: loadJson,
      }).then(async (instance) => {
        inst = instance;
        const newState = instance.viewState.set("currentPageIndex", page);
        instance.setViewState(newState);
        instance.setAnnotationCreatorName("01");
        instance.addEventListener(
          "annotations.create",
          async (createdAnnotations) => {
            await instance.save();
          }
        );
        instance.addEventListener(
          "annotations.delete",
          async (deletedAnnotations) => {
            await instance.save();
          }
        );
        instance.addEventListener("annotations.press", async (event) => {
          if (event.selected) {
            const annotate = instance.getSelectedAnnotation();
            await instance.save();
            setDrawerOpenRight(false);
            setDrawerOpenBottom(true);
            setAnnotateID({
              id: annotate.id,
              index: annotate.pageIndex,
            });
          }
        });
      });
    })();

    // return () => PSPDFKit && PSPDFKit.unload(container);
  }, [props.document, page]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }}>
      <Drawer
        open={drawerOpenBottom}
        anchor="bottom"
        onClose={toggleDrawer(false, "bt")}
      >
        <Box
          sx={{
            width: "auto",
            height: "250px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          role="presentation"
          onClick={toggleDrawer(false, "bt")}
          onKeyDown={toggleDrawer(false, "bt")}
        >
          <div>Information About Tag ID:-{annotateID.id}</div>
          <div>Information About Tag INDEX:-{annotateID.index}</div>
        </Box>
      </Drawer>
      <Drawer
        open={drawerOpenRight}
        anchor="right"
        onClose={toggleDrawer(false, "rt")}
      >
        <Box
          sx={{
            width: "250px",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={toggleDrawer(false, "rt")}
          onKeyDown={toggleDrawer(false, "rt")}
        >
          <div
            style={{ marginTop: "15px", backgroundColor: "grey" }}
            onClick={handleClick}
          >
            <div>Information About Tag ID:-{annotateID.id}</div>
            <div>Information About Tag INDEX:-{annotateID.index}</div>
          </div>
        </Box>
      </Drawer>
    </div>
  );
}
