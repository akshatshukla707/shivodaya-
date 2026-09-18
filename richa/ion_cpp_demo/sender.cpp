#include <iostream>

extern "C" {
#include <bp.h>
}

using namespace std;

int main()
{
    std::cout << "Shivodaya ION sender starting...\n";

    if (bp_attach() < 0)
    {
        std::cerr << "Failed to attach to ION BP service.\n";
        return 1;
    }
	
	BpSAP sap     =  nullptr;
	char ownEid[] =  "ipn:1.1";

	if(bp_open_source(ownEid,&sap,0) < 0)
	{
		cerr<<"Failed to open source endpoint";
		writeErrmsgMemos();

		bp_detach();
		return 1;
	}

	cout<<"OPENED endpoint 	ipn:1.1 \n";
	
	bp_close(sap);

	cout<<"Closed endpoint \n";

    std::cout << "Successfully attached to ION BP service.\n";

    bp_detach();

    std::cout << "Detached from ION BP service.\n";

    return 0;
}
