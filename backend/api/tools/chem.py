# /usr/bin/python3
from smolagents.tools import Tool
from rdkit import Chem
from rdkit.Chem import Draw
import uuid


class MoleculeImageTool(Tool):
    name = "molecule_image"
    description = (
        "Generates a molecule image from a SMILES formula and saves it as a PNG."
    )
    inputs = {
        "formula": {
            "type": "string",
            "description": "SMILES formula of the molecule",
            "nullable": True,
        },
        "output_path": {
            "type": "string",
            "description": "Path to save the PNG image",
            "nullable": True,
        },
    }
    output_type = "string"

    def forward(self, formula=None, output_path=None):
        if output_path is None:
            unique_id = str(uuid.uuid4())
            output_path = f"devenv/static/plots/molecule_{unique_id}.png"
        mol = Chem.MolFromSmiles(formula)
        if mol is None:
            raise ValueError("Invalid chemical formula (SMILES) provided.")
        Draw.MolToFile(mol, output_path)
        return output_path
